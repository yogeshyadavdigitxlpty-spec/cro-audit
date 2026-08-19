const { validateLeadRequest, normalizeUrl } = require('./utils/validate');

const JSON_HEADERS = { 'Content-Type': 'application/json' };

// Forwards the lead to whatever is configured in LEAD_WEBHOOK_URL — point
// this at Zapier, Make, Airtable, HubSpot, or your own endpoint. Safe no-op
// when unset, so the base app never requires a paid service to run.
async function forwardToWebhook(lead) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    return { forwarded: false };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    return { forwarded: response.ok };
  } catch (err) {
    console.error('Failed to forward lead to webhook:', err.message);
    return { forwarded: false };
  }
}

// Emails the lead notification via Resend (https://resend.com) — no SMTP
// setup needed, just an API key. Safe no-op when unset. Note: until you
// verify a sending domain in Resend, their sandbox mode only delivers to
// the email address you signed up to Resend with — verify a domain there
// once you're ready to notify any address reliably.
async function sendLeadEmail(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.LEAD_NOTIFY_EMAIL;
  if (!apiKey || !notifyEmail) {
    return { emailed: false };
  }

  const fromAddress = process.env.LEAD_NOTIFY_FROM || 'Website Audit <onboarding@resend.dev>';

  const html = `
    <h2>New Full Site Audit request</h2>
    <p><strong>Name:</strong> ${escapeHtml(lead.fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(lead.phone || 'Not provided')}</p>
    <p><strong>Website:</strong> ${escapeHtml(lead.url)}</p>
    <p><strong>Submitted at:</strong> ${escapeHtml(lead.submittedAt)}</p>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [notifyEmail],
        subject: `New Full Site Audit request — ${lead.fullName}`,
        html,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Resend email failed:', response.status, errBody);
      return { emailed: false };
    }
    return { emailed: true };
  } catch (err) {
    console.error('Failed to send lead email:', err.message);
    return { emailed: false };
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Method not allowed.' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Invalid JSON body.' }) };
  }

  const errors = validateLeadRequest(body);
  if (errors.length > 0) {
    return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: errors.join(' ') }) };
  }

  const lead = {
    url: normalizeUrl(body.url),
    fullName: String(body.fullName).trim(),
    email: String(body.email).trim().toLowerCase(),
    phone: body.phone ? String(body.phone).trim() : null,
    submittedAt: new Date().toISOString(),
    source: 'full-site-audit-form',
  };

  try {
    const [webhookResult, emailResult] = await Promise.all([
      forwardToWebhook(lead),
      sendLeadEmail(lead),
    ]);

    if (!webhookResult.forwarded && !emailResult.emailed) {
      // Neither delivery method is configured — at least keep a record in
      // the function logs so the lead isn't silently lost.
      console.log('Lead captured (no webhook or email configured):', lead);
    }

    // Always return success to the client once the lead is captured server
    // side — delivery issues are logged, not surfaced to the user.
    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('Lead function failed:', err);
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({ error: 'We could not submit your request. Please try again shortly.' }),
    };
  }
};

