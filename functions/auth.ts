import { verifyPassword } from '../lib/auth';

/**
 * Authentication system with Cloudflare D1 database support
 * Includes fallback to demo users for development
 */

// Demo users - fallback when no D1 database is available
const DEMO_USERS = {
  admin: {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@projectiron.pl',
    role: 'admin',
    is_active: true
  },
  member: {
    id: 2,
    username: 'member',
    password: 'member123',
    email: 'member@projectiron.pl',
    role: 'member',
    is_active: true
  }
};

/**
 * Authentication endpoints for login/logout
 * POST /auth - Login
 * DELETE /auth - Logout
 */

// @ts-ignore: Cloudflare Pages provides the context type at runtime
export const onRequestPost = async (context: any) => {
  try {
    const { request, env } = context;
    
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Nazwa użytkownika i hasło są wymagane' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let user = null;

    // Try D1 database authentication first
    if (env.DB) {
      try {
        const result = await env.DB.prepare(
          'SELECT id, username, email, password_hash, role, is_active FROM users WHERE username = ?'
        ).bind(username).first();
        
        if (result) {
          // Check if user is active
          if (!result.is_active) {
            return new Response(JSON.stringify({ 
              success: false, 
              message: 'Twoje konto oczekuje na zatwierdzenie przez administratora' 
            }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          
          // Verify password
          const isValidPassword = await verifyPassword(password, result.password_hash as string);
          if (isValidPassword) {
            user = {
              id: result.id as number,
              username: result.username as string,
              email: result.email as string,
              role: result.role as string,
              is_active: result.is_active as boolean
            };
          }
        }
      } catch (dbError) {
        console.error('Database authentication error:', dbError);
        // Fall through to demo authentication
      }
    }

    // Fallback to demo users if D1 authentication failed or no database
    if (!user) {
      const demoUser = DEMO_USERS[username as keyof typeof DEMO_USERS];
      if (demoUser && demoUser.password === password && demoUser.is_active) {
        user = {
          id: demoUser.id,
          username: demoUser.username,
          email: demoUser.email,
          role: demoUser.role,
          is_active: demoUser.is_active
        };
      }
    }

    // Check if authentication was successful
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Nieprawidłowe dane logowania' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create session cookie
    const response = new Response(JSON.stringify({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Set-Cookie': `auth_session=authenticated; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400` // 24 hours
      },
    });

    return response;
  } catch (error) {
    console.error('Auth login error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Błąd serwera' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// @ts-ignore: Cloudflare Pages provides the context type at runtime
export const onRequestDelete = async (context: any) => {
  try {
    // Logout - clear session cookie
    const response = new Response(JSON.stringify({ 
      success: true, 
      message: 'Logged out successfully' 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Set-Cookie': 'auth_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
      },
    });

    return response;
  } catch (error) {
    console.error('Auth logout error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};