import type { PagesFunction } from '@cloudflare/workers-types';
import { z } from 'zod';

// Helper to get env variable from Cloudflare env or Astro import.meta.env
function getEnvVar(env: Record<string, any>, key: string): string | undefined {
  if (env && typeof env[key] === 'string' && env[key]) return env[key];
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key])
    return import.meta.env[key];
  return undefined;
}

// Define the schema for the incoming request body
const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address').max(254, 'Email too long'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required').max(5000, 'Message too long'),
  consent: z.boolean().refine(val => val === true, 'Consent is required'),
  turnstileToken: z.string().min(1, 'Turnstile token is required'),
});
const test = 'test';

export const onRequestPost: PagesFunction = async context => {
  const { request, env } = context;

  // Use helper to get variables
  const TURNSTILE_SECRET = getEnvVar(env, 'TURNSTILE_SECRET');
  const RESEND_API_KEY = getEnvVar(env, 'RESEND_API_KEY');
  const OWNER_EMAIL = getEnvVar(env, 'OWNER_EMAIL');
  const PUBLIC_SITE_URL = getEnvVar(env, 'PUBLIC_SITE_URL');

  try {
    // Validate request method and content type
    if (request.method !== 'POST') {
      return Response.json(
        { error: 'Method not allowed' },
        {
          status: 405,
          headers: { Allow: 'POST' },
        },
      );
    }

    // Check required environment variables
    if (!TURNSTILE_SECRET || !RESEND_API_KEY || !OWNER_EMAIL) {
      console.error('Missing required environment variables');
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Parse and validate the request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const parsedData = ContactSchema.parse(body);

    // Verify Turnstile token
    const turnstileResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: TURNSTILE_SECRET,
          response: parsedData.turnstileToken,
          remoteip:
            request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || '',
        }),
      },
    );

    if (!turnstileResponse.ok) {
      console.error('Turnstile API error:', turnstileResponse.status);
      return Response.json({ error: 'Verification service unavailable' }, { status: 503 });
    }

    const turnstileResult = await turnstileResponse.json();
    if (!turnstileResult.success) {
      console.warn('Turnstile verification failed:', turnstileResult['error-codes']);
      return Response.json({ error: 'Verification failed' }, { status: 403 });
    }

    // Prepare email content
    const siteHostname = PUBLIC_SITE_URL ? new URL(PUBLIC_SITE_URL).hostname : 'yourdomain.com';

    const emailText = `
Name: ${parsedData.name}
Email: ${parsedData.email}
Phone: ${parsedData.phone || 'N/A'}
Message: ${parsedData.message}
Consent: ${parsedData.consent ? 'Yes' : 'No'}
Sent at: ${new Date().toISOString()}
    `.trim();

    const emailHtml = `
      <h2>Nowe zapytanie ze strony</h2>
      <p><strong>Imię:</strong> ${parsedData.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${parsedData.email}">${parsedData.email}</a></p>
      <p><strong>Telefon:</strong> ${parsedData.phone || 'Nie podano'}</p>
      <p><strong>Wiadomość:</strong></p>
      <blockquote style="border-left: 3px solid #ccc; padding-left: 15px; margin-left: 0;">
        ${parsedData.message.replace(/\n/g, '<br>')}
      </blockquote>
      <p><strong>Zgoda:</strong> ${parsedData.consent ? 'Tak' : 'Nie'}</p>
      <p><small>Wysłano: ${new Date().toLocaleString('pl-PL')}</small></p>
    `;

    // Send email via Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `no-reply@${siteHostname}`,
        to: OWNER_EMAIL,
        subject: `Nowe zapytanie od ${parsedData.name}`,
        text: emailText,
        html: emailHtml,
        reply_to: parsedData.email,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Failed to send email:', {
        status: emailResponse.status,
        error: errorText,
      });
      return Response.json({ error: 'Failed to send message' }, { status: 500 });
    }

    const emailResult = await emailResponse.json();
    console.log('Email sent successfully:', emailResult.id);

    // Return success response
    return Response.json({
      success: true,
      message: 'Your message has been sent successfully',
    });
  } catch (error) {
    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    console.error('Unexpected error handling contact request:', error);
    return Response.json(
      {
        error: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
};
