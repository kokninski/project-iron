# Development Guide - Project Iron

## Quick Start

### Development Server

```bash
npm run dev                # Start Astro dev server (localhost:4321)
```

### Building & Preview

```bash
npm run build              # Build static site for production
npm run preview            # Preview built site locally
```

### Code Quality

```bash
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

### Cloudflare Pages Functions Development

```bash
npm run build              # Build first
npm run cf:dev            # Serve with Pages Functions (localhost:8788)
npm run cf:inspect        # Serve with DevTools for debugging functions
```

## Environment Variables

### Local Development

- **Front-end** (Astro): Use `.env` file with `PUBLIC_` prefix
- **Pages Functions**: Use `.dev.vars` file (no prefix needed)

### TypeScript Support

Environment variables are fully typed in `src/env.d.ts`:

```typescript
// ✅ Server-side (Pages Functions)
export const onRequestPost: PagesFunction = async ({ env }) => {
  env.TURNSTILE_SECRET; // ✅ Typed
  env.RESEND_API_KEY; // ✅ Typed
  env.OWNER_EMAIL; // ✅ Typed
};

// ✅ Client-side (Astro components)
const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY; // ✅ Typed
const siteUrl = import.meta.env.PUBLIC_SITE_URL; // ✅ Typed
```

📖 **For detailed setup instructions, see:** `docs/environment-variables.md`

### Production

- Set all environment variables in **Cloudflare Pages** project settings
- Variables needed:
  - `TURNSTILE_SITE_KEY` & `TURNSTILE_SECRET`
  - `RESEND_API_KEY`
  - `OWNER_EMAIL`
  - `CF_ANALYTICS_TOKEN` (optional)

## VS Code Integration

### Tasks (Ctrl+Shift+P → "Tasks: Run Task")

- **Dev**: Start Astro development server
- **Build**: Build production site
- **Preview**: Preview built site
- **Lint**: Run ESLint
- **Format**: Format all files
- **CF Pages Dev**: Start Cloudflare Pages dev server

### Debug Configurations (F5)

- **Astro: Dev**: Debug Astro development server
- **Astro: Preview**: Debug preview server
- **Wrangler: Pages Dev**: Debug Pages Functions

### Recommended Extensions

All extensions are listed in `.vscode/extensions.json` and will be suggested automatically.

## Git Workflow

### Pre-commit Hooks

- **ESLint**: Automatically fixes code issues
- **Prettier**: Automatically formats code
- Hooks run automatically on `git commit`

### Manual Code Quality

```bash
npm run lint               # Check for issues
npm run format             # Format code
```

## Pages Functions Development

1. **Build** first: `npm run build`
2. **Local testing**: `npm run cf:dev`
3. **Debug functions**: `npm run cf:inspect` (opens Chrome DevTools)
4. **Environment**: Configure `.dev.vars` for local, Cloudflare Pages settings for production

## Troubleshooting

### Port Conflicts (4321)

Change port in package.json: `"dev": "astro dev --port 5173"`

### ESLint Not Working

1. Ensure ESLint extension is installed
2. Check `.eslintrc.cjs` configuration
3. Restart VS Code

### Functions Not Working

1. Check `.dev.vars` file exists and has correct variables
2. Ensure `wrangler` is installed: `npm install -D wrangler`
3. Restart `cf:dev` server after changing env vars

### Prettier Not Formatting

1. Set Prettier as default formatter in VS Code
2. Check `.prettierrc` configuration
3. Ensure `formatOnSave` is enabled in settings
