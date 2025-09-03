/**
 * Authentication utilities for Cloudflare Workers/Pages Functions
 * Uses Web Crypto API for password hashing and session management
 */

/**
 * Generate a secure random salt
 */
async function generateSalt(): Promise<Uint8Array> {
  return crypto.getRandomValues(new Uint8Array(16));
}

/**
 * Hash a password using PBKDF2
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await generateSalt();
  const passwordBuffer = new TextEncoder().encode(password);
  
  const key = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  );
  
  // Combine salt and hash
  const combined = new Uint8Array(salt.length + hashBuffer.byteLength);
  combined.set(salt, 0);
  combined.set(new Uint8Array(hashBuffer), salt.length);
  
  // Convert to base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // Decode base64 hash
    const combined = Uint8Array.from(atob(hash), c => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);
    
    const passwordBuffer = new TextEncoder().encode(password);
    
    const key = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      256
    );
    
    const computedHash = new Uint8Array(hashBuffer);
    
    // Compare hashes
    if (computedHash.length !== storedHash.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < computedHash.length; i++) {
      result |= computedHash[i] ^ storedHash[i];
    }
    
    return result === 0;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Generate a secure session token
 */
export async function generateSessionToken(): Promise<string> {
  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...tokenBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * User interface
 */
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

/**
 * Authentication service class
 */
export class AuthService {
  constructor(private db: D1Database) {}
  
  /**
   * Authenticate user with username/password
   */
  async authenticateUser(username: string, password: string): Promise<User | null> {
    try {
      const result = await this.db.prepare(
        'SELECT id, username, email, password_hash, role, is_active, created_at FROM users WHERE username = ? AND is_active = 1'
      ).bind(username).first();
      
      if (!result) {
        return null;
      }
      
      const isValidPassword = await verifyPassword(password, result.password_hash as string);
      if (!isValidPassword) {
        return null;
      }
      
      return {
        id: result.id as number,
        username: result.username as string,
        email: result.email as string,
        role: result.role as string,
        is_active: result.is_active as boolean,
        created_at: result.created_at as string
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }
  
  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User | null> {
    try {
      const result = await this.db.prepare(
        'SELECT id, username, email, role, is_active, created_at FROM users WHERE id = ? AND is_active = 1'
      ).bind(id).first();
      
      if (!result) {
        return null;
      }
      
      return {
        id: result.id as number,
        username: result.username as string,
        email: result.email as string,
        role: result.role as string,
        is_active: result.is_active as boolean,
        created_at: result.created_at as string
      };
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
  
  /**
   * Create a new user
   */
  async createUser(username: string, email: string, password: string, role: string = 'member'): Promise<User | null> {
    try {
      const passwordHash = await hashPassword(password);
      
      const result = await this.db.prepare(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?) RETURNING id, username, email, role, is_active, created_at'
      ).bind(username, email, passwordHash, role).first();
      
      if (!result) {
        return null;
      }
      
      return {
        id: result.id as number,
        username: result.username as string,
        email: result.email as string,
        role: result.role as string,
        is_active: result.is_active as boolean,
        created_at: result.created_at as string
      };
    } catch (error) {
      console.error('Create user error:', error);
      return null;
    }
  }
}