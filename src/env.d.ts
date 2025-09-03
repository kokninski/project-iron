/// <reference types="astro/client" />

/**
 * Environment Variables Type Declarations
 *
 * These interface declarations provide TypeScript support for environment variables
 * used in Cloudflare Pages Functions and Astro client-side code.
 */

declare namespace App {
  interface Locals {}
}

/**
 * Cloudflare Pages Functions Environment Variables
 *
 * These variables are available in the `env` parameter of Pages Functions
 * and must be configured in the Cloudflare Pages project settings.
 */
interface CloudflareEnv {
  /**
   * Turnstile Site Key (Public)
   * Used client-side for rendering the Turnstile widget
   * Configure in: Cloudflare Pages → Settings → Environment Variables
   */
  TURNSTILE_SITE_KEY: string;

  /**
   * Turnstile Secret Key (Private)
   * Used server-side for verifying Turnstile responses
   * Configure in: Cloudflare Pages → Settings → Environment Variables
   */
  TURNSTILE_SECRET: string;

  /**
   * Resend API Key (Private)
   * Used for sending emails via the Resend service
   * Configure in: Cloudflare Pages → Settings → Environment Variables
   */
  RESEND_API_KEY: string;

  /**
   * Owner Email Address (Private)
   * The email address where contact form submissions are sent
   * Configure in: Cloudflare Pages → Settings → Environment Variables
   */
  OWNER_EMAIL: string;

  /**
   * Cloudflare Analytics Token (Optional)
   * Used for Cloudflare Web Analytics integration
   * Configure in: Cloudflare Pages → Settings → Environment Variables
   */
  CF_ANALYTICS_TOKEN?: string;

  /**
   * Cloudflare D1 Database for Authentication
   * Used for storing user accounts and session data
   * Automatically bound through wrangler.toml configuration
   */
  AUTH_DB: D1Database;
}

/**
 * Astro Client-Side Environment Variables
 *
 * These variables are available in Astro components and must be prefixed with PUBLIC_
 * Configure in: .env file for local development, Cloudflare Pages settings for production
 */
interface ImportMetaEnv {
  /**
   * Public Turnstile Site Key
   * Exposed to client-side code for widget rendering
   * Local: .env → PUBLIC_TURNSTILE_SITE_KEY=your_site_key
   * Production: Cloudflare Pages → Environment Variables → PUBLIC_TURNSTILE_SITE_KEY
   */
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;

  /**
   * Public Site URL
   * Base URL of the website for generating absolute URLs
   * Local: .env → PUBLIC_SITE_URL=http://localhost:4321
   * Production: Cloudflare Pages → Environment Variables → PUBLIC_SITE_URL=https://yourdomain.com
   */
  readonly PUBLIC_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Pages Function Context Type
 *
 * This extends the default PagesFunction type to include our CloudflareEnv
 */
declare global {
  interface PagesFunction<Env = CloudflareEnv> {
    (context: {
      request: Request;
      env: Env;
      params: Record<string, string>;
      waitUntil: (promise: Promise<any>) => void;
      next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
      data: Record<string, unknown>;
    }): Response | Promise<Response>;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    TURNSTILE_SECRET: string;
    TURNSTILE_SITE_KEY: string;
    RESEND_API_KEY: string;
    OWNER_EMAIL: string;
  }
}
