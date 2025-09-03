import { hashPassword } from '../lib/auth';

/**
 * User signup endpoint
 * Creates new user accounts in pending status (is_active = 0)
 * Requires admin approval before users can login
 */

// @ts-ignore: Cloudflare Pages provides the context type at runtime
export const onRequestPost = async (context: any) => {
  try {
    const { request, env } = context;
    
    const body = await request.json();
    const { username, email, password } = body;

    // Validation
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Nazwa użytkownika, email i hasło są wymagane' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Basic validation
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

    // Email validation
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

    // For now, use demo mode if no D1 database is available
    // In production, this would connect to the D1 database
    if (!env.DB) {
      // Demo mode - just return success message
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Wniosek o członkostwo został złożony. W trybie demo nie ma rzeczywistego zapisu. W produkcji konto zostałoby utworzone i oczekiwałoby na zatwierdzenie przez administratora.' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // Check if username already exists
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
      
      // Create user with is_active = 0 (pending approval)
      const result = await env.DB.prepare(
        'INSERT INTO users (username, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)'
      ).bind(username, email, passwordHash, 'member', 0).run();

      if (result.success) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Wniosek o członkostwo został złożony pomyślnie. Twoje konto oczekuje na zatwierdzenie przez administratora. Otrzymasz powiadomienie email po zatwierdzeniu.' 
        }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        throw new Error('Failed to create user');
      }

    } catch (dbError) {
      console.error('Database error during signup:', dbError);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Błąd podczas tworzenia konta. Spróbuj ponownie.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Signup error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Błąd serwera. Spróbuj ponownie.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};