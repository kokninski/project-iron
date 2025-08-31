// @ts-ignore: Cloudflare Pages provides the context type at runtime
export const onRequestPost = async (context: any) => {
  try {
    const { request, env } = context;
    const body = await request.json();
    const turnstileResponse = body['cf-turnstile-response'];
    const ip = request.headers.get('CF-Connecting-IP') || '';

    // Validate Turnstile
    const secret = env.TURNSTILE_SECRET;
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: turnstileResponse,
        remoteip: ip,
      }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return new Response(JSON.stringify({ message: 'Weryfikacja CAPTCHA nie powiodła się.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send email via Resend
    const RESEND_API_KEY = env.RESEND_API_KEY;
    const OWNER_EMAIL = env.OWNER_EMAIL;
    const { name, email, phone, message } = body;
    const emailBody = `Imię i nazwisko: ${name}\nE-mail: ${email}\nTelefon: ${phone || '-'}\nWiadomość:\n${message}`;

    // log to console
    console.log('Sending email via Resend:', {
      from: `Formularz Kontaktowy <${OWNER_EMAIL}>`,
      to: [OWNER_EMAIL],
      subject: 'Nowa wiadomość z formularza kontaktowego',
      text: emailBody,
      reply_to: email,
    });

    // log to console
    console.log(`Bearer ${RESEND_API_KEY}`);

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // from: `Formularz Kontaktowy <${OWNER_EMAIL}>`,
        from: `Formularz Kontaktowy <onboarding@resend.dev>`,
        to: [OWNER_EMAIL],
        subject: 'Nowa wiadomość z formularza kontaktowego',
        text: emailBody,
        reply_to: email,
      }),
    });

    if (!emailRes.ok) {
      console.log('Error sending email:', await emailRes);
      return new Response(JSON.stringify({ message: 'Nie udało się wysłać e-maila.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'OK' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ message: 'Błąd serwera.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
