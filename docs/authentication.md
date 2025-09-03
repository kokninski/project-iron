# Private Section Authentication System

This document describes the implementation of the private section with authentication for Project Iron.

## Overview

The private section provides a protected area for 'members only' content, accessible only after login. The system uses:

- **Frontend**: Astro pages with client-side authentication checks
- **Backend**: Cloudflare Pages Functions for authentication endpoints
- **Database**: Cloudflare D1 for user storage (configured for future expansion)
- **Session Management**: HTTP-only cookies for security

## Current Implementation

### Demo Mode
The current implementation uses hardcoded demo users for testing:
- **admin** / admin123 (administrator role)
- **member** / member123 (member role)

### File Structure

```
src/
├── pages/
│   ├── login.astro          # Login page with form
│   └── private.astro        # Protected member content
functions/
├── auth.ts                  # Authentication endpoints
lib/
├── auth.ts                  # Authentication utilities (for D1 expansion)
migrations/
├── 0001_initial.sql         # D1 database schema
```

## Features

### Login System
- Clean, responsive login form
- Client-side form validation
- Error handling for invalid credentials
- Session management with secure cookies

### Private Section
- Rich member-exclusive content
- Member benefits display
- Exclusive articles and resources
- Dedicated member contact information
- Logout functionality

### Security
- Client-side authentication checks
- LocalStorage for demo session persistence
- Prepared for HTTP-only cookie sessions
- Secure logout with session clearing

## API Endpoints

### POST /auth
Authenticates user and creates session.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@projectiron.pl",
    "role": "admin"
  }
}
```

### DELETE /auth
Logs out user and clears session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Future Enhancements

### Production Database Setup

1. **Create D1 Database:**
   ```bash
   npx wrangler d1 create project-iron-auth
   ```

2. **Apply Migrations:**
   ```bash
   npx wrangler d1 migrations apply project-iron-auth
   ```

3. **Bind Database in wrangler.toml:**
   ```toml
   [[d1_databases]]
   binding = "AUTH_DB"
   database_name = "project-iron-auth"
   database_id = "your-database-id"
   ```

### Enhanced Security Features
- Password hashing with PBKDF2/bcrypt
- Session token management
- Rate limiting for login attempts
- Two-factor authentication
- Password reset functionality

### User Management
- User registration system
- Admin panel for user management
- Role-based access control
- Profile management

### Additional Features
- Member-only blog posts
- Downloadable resources
- Member directory/forum
- Notification system

## Development

### Local Testing
1. Build the project: `npm run build`
2. Test with Cloudflare Pages: `npm run cf:dev`
3. Navigate to `/login` to test authentication

### Environment Variables
Copy `.dev.vars.example` to `.dev.vars` for local development.

### Database Migration
The included SQL migration creates:
- Users table with authentication fields
- Indexes for performance
- Default admin and member users

## Deployment Notes

### Cloudflare Pages Configuration
1. Set environment variables in Cloudflare Pages dashboard
2. Configure D1 database binding
3. Deploy functions automatically with Pages

### Security Considerations
- Change default passwords immediately
- Configure proper CORS policies
- Enable HTTPS-only cookies in production
- Implement proper session expiration

## Testing Credentials

For demo purposes:
- **Username**: admin, **Password**: admin123
- **Username**: member, **Password**: member123

These should be changed or removed in production.