# Environment Variables Configuration Guide

This guide explains how to configure environment variables for Project Iron across different environments.

## 📋 Variable Types & Usage

### Server-Side Variables (Pages Functions)

These variables are available in `functions/contact.ts` via the `env` parameter:

```typescript
export const onRequestPost: PagesFunction = async ({ request, env }) => {
  // env.TURNSTILE_SECRET - server-side verification
  // env.RESEND_API_KEY - email sending
  // env.OWNER_EMAIL - recipient email
};
```

### Client-Side Variables (Astro Components)

These variables are available in `.astro` files via `import.meta.env`:

```astro
---
// Available in Astro components
const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
const siteUrl = import.meta.env.PUBLIC_SITE_URL;
---
```

## 🔧 Local Development Setup

### 1. Server-Side (.dev.vars)

Create `.dev.vars` in the project root:

```bash
# .dev.vars (for Pages Functions)
TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET=1x0000000000000000000000000000000AA
RESEND_API_KEY=re_123456789
OWNER_EMAIL=hello@yourdomain.com
CF_ANALYTICS_TOKEN=optional_token
```

### 2. Client-Side (.env)

Create `.env` in the project root:

```bash
# .env (for Astro client-side)
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
PUBLIC_SITE_URL=http://localhost:4321
```

## 🚀 Production Setup (Cloudflare Pages)

### Step 1: Access Environment Variables Settings

1. Go to **Cloudflare Dashboard**
2. Navigate to **Pages** → **Your Project**
3. Click **Settings** tab
4. Scroll to **Environment Variables** section

### Step 2: Add Variables for Production

Add the following variables in **Production** environment:

| Variable Name               | Value                      | Usage                     |
| --------------------------- | -------------------------- | ------------------------- |
| `TURNSTILE_SITE_KEY`        | Your Turnstile site key    | Server-side widget config |
| `TURNSTILE_SECRET`          | Your Turnstile secret key  | Server-side verification  |
| `RESEND_API_KEY`            | Your Resend API key        | Email sending             |
| `OWNER_EMAIL`               | hello@yourdomain.com       | Contact form recipient    |
| `CF_ANALYTICS_TOKEN`        | (optional)                 | Analytics integration     |
| `PUBLIC_TURNSTILE_SITE_KEY` | Same as TURNSTILE_SITE_KEY | Client-side widget        |
| `PUBLIC_SITE_URL`           | https://yourdomain.com     | Absolute URL generation   |

### Step 3: Preview Environment (Optional)

For testing preview deployments, add the same variables under **Preview** environment with test values.

## 🔑 Getting API Keys

### Turnstile (Anti-spam)

1. Go to **Cloudflare Dashboard** → **Turnstile**
2. Create a new site
3. Copy **Site Key** (public) and **Secret Key** (private)

### Resend (Email)

1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys** section
3. Create a new API key
4. Verify your domain for sending emails

## 🛠️ Development Commands

### Testing Environment Variables

```bash
# Test server-side variables (Pages Functions)
npm run build
npm run cf:dev                    # Uses .dev.vars

# Test client-side variables (Astro)
npm run dev                       # Uses .env
```

### Debugging Variables

```typescript
// In functions/contact.ts
console.log('Available env vars:', Object.keys(env));

// In .astro files
console.log('Site key:', import.meta.env.PUBLIC_TURNSTILE_SITE_KEY);
```

## 🚨 Security Best Practices

### Never Expose Private Keys

- ❌ Don't use private keys in client-side code
- ❌ Don't commit `.dev.vars` or `.env` files
- ✅ Use `PUBLIC_` prefix only for truly public data

### Variable Naming Convention

```bash
# Server-side only (private)
TURNSTILE_SECRET=secret_key
RESEND_API_KEY=private_key

# Client-side accessible (public)
PUBLIC_TURNSTILE_SITE_KEY=public_key
PUBLIC_SITE_URL=https://domain.com
```

## 🔄 Environment Variable Flow

```
Development:
├── .env → Astro client-side (PUBLIC_ vars)
└── .dev.vars → Pages Functions (all vars)

Production:
└── Cloudflare Pages Settings → Both client & server
    ├── PUBLIC_ vars → Available in Astro
    └── All vars → Available in Functions
```

## ✅ Verification Checklist

### Local Development

- [ ] `.dev.vars` exists with all required variables
- [ ] `.env` exists with PUBLIC\_ variables
- [ ] Contact form loads Turnstile widget
- [ ] `npm run cf:dev` shows environment bindings

### Production Deployment

- [ ] All variables added to Cloudflare Pages settings
- [ ] PUBLIC\_ variables accessible in browser console
- [ ] Contact form submission works
- [ ] Emails are delivered successfully

## 🔍 Troubleshooting

### "Variable not defined" errors

- Check variable names match exactly (case-sensitive)
- Ensure PUBLIC\_ prefix for client-side variables
- Restart dev servers after changing env files

### Turnstile not loading

- Verify `PUBLIC_TURNSTILE_SITE_KEY` is set
- Check browser console for JavaScript errors
- Ensure site key matches your domain

### Email not sending

- Verify `RESEND_API_KEY` is valid
- Check `OWNER_EMAIL` format
- Review Resend dashboard for delivery logs
