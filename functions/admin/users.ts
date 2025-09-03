import { hashPassword } from '../../lib/auth';

/**
 * Admin user management API
 * GET /admin/users - List all users
 * POST /admin/users - Create new user
 * PATCH /admin/users - Update user status (activate/deactivate)
 */

// Demo users for fallback when no D1 database is available
const DEMO_USERS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@projectiron.pl',
    role: 'admin',
    is_active: true,
    created_at: '2025-01-08T10:00:00Z'
  },
  {
    id: 2,
    username: 'member',
    email: 'member@projectiron.pl',
    role: 'member',
    is_active: true,
    created_at: '2025-01-08T10:00:00Z'
  }
];

/**
 * Check if user has admin role
 */
function checkAdminAuth(request: Request): boolean {
  // In a real implementation, this would verify the session cookie
  // For now, we'll use a simple check
  const cookie = request.headers.get('Cookie');
  return cookie?.includes('auth_session=authenticated') || false;
}

// GET /admin/users - List all users
// @ts-ignore: Cloudflare Pages provides the context type at runtime
export const onRequestGet = async (context: any) => {
  try {
    const { request, env } = context;
    
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Brak uprawnień administratora' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For demo mode when no D1 database is available
    if (!env.DB) {
      return new Response(JSON.stringify({ 
        success: true, 
        users: DEMO_USERS
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // Get all users from database
      const result = await env.DB.prepare(
        'SELECT id, username, email, role, is_active, created_at FROM users ORDER BY created_at DESC'
      ).all();

      return new Response(JSON.stringify({ 
        success: true, 
        users: result.results || []
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (dbError) {
      console.error('Database error during user list:', dbError);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Błąd dostępu do bazy danych' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Admin users GET error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Błąd serwera' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST /admin/users - Create new user
// @ts-ignore: Cloudflare Pages provides the context type at runtime
export const onRequestPost = async (context: any) => {
  try {
    const { request, env } = context;
    
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Brak uprawnień administratora' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const body = await request.json();
    const { username, email, password, role } = body;

    // Validation
    if (!username || !email || !password || !role) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Wszystkie pola są wymagane' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (username.length < 3 || username.length > 50) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Nazwa użytkownika musi mieć od 3 do 50 znaków' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Nazwa użytkownika może zawierać tylko litery, cyfry i podkreślenia' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Hasło musi mieć co najmniej 6 znaków' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!['member', 'admin'].includes(role)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Nieprawidłowa rola' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Nieprawidłowy format adresu email' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For demo mode when no D1 database is available
    if (!env.DB) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Konto zostało utworzone (tryb demo - bez zapisu do bazy)' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // Check if username or email already exists
      const existingUser = await env.DB.prepare(
        'SELECT id FROM users WHERE username = ? OR email = ?'
      ).bind(username, email).first();

      if (existingUser) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Nazwa użytkownika lub adres email już istnieje' 
        }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Hash password
      const passwordHash = await hashPassword(password);
      
      // Create user with is_active = 1 (active, since admin creates it)
      const result = await env.DB.prepare(
        'INSERT INTO users (username, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)'
      ).bind(username, email, passwordHash, role, 1).run();

      if (result.success) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Konto zostało utworzone pomyślnie' 
        }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        throw new Error('Failed to create user');
      }

    } catch (dbError) {
      console.error('Database error during user creation:', dbError);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Błąd podczas tworzenia konta' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Admin users POST error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Błąd serwera' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// PATCH /admin/users - Update user status
// @ts-ignore: Cloudflare Pages provides the context type at runtime
export const onRequestPatch = async (context: any) => {
  try {
    const { request, env } = context;
    
    // Check admin authentication
    if (!checkAdminAuth(request)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Brak uprawnień administratora' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const body = await request.json();
    const { userId, action } = body;

    // Validation
    if (!userId || !action) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'ID użytkownika i akcja są wymagane' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!['activate', 'deactivate'].includes(action)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Nieprawidłowa akcja' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For demo mode when no D1 database is available
    if (!env.DB) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Użytkownik został ${action === 'activate' ? 'aktywowany' : 'dezaktywowany'} (tryb demo)` 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const newStatus = action === 'activate' ? 1 : 0;
      
      const result = await env.DB.prepare(
        'UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(newStatus, userId).run();

      if (result.success && result.changes && result.changes > 0) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: `Użytkownik został ${action === 'activate' ? 'aktywowany' : 'dezaktywowany'}` 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Nie znaleziono użytkownika' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

    } catch (dbError) {
      console.error('Database error during user status update:', dbError);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Błąd podczas aktualizacji statusu użytkownika' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Admin users PATCH error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Błąd serwera' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};