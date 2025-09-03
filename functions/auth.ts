/**
 * Simple authentication for demo purposes
 * In production, this would connect to Cloudflare D1 database
 */

// Demo users - in production these would be in the database
const DEMO_USERS = {
  admin: {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@projectiron.pl',
    role: 'admin'
  },
  member: {
    id: 2,
    username: 'member',
    password: 'member123',
    email: 'member@projectiron.pl',
    role: 'member'
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
    const { request } = context;
    
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Username and password are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check demo credentials
    const user = DEMO_USERS[username as keyof typeof DEMO_USERS];
    if (!user || user.password !== password) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Invalid credentials' 
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
      message: 'Server error' 
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