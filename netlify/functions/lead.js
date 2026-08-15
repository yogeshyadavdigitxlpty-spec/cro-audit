const { validateLeadRequest, normalizeUrl } = require('./utils/validate');

const JSON_HEADERS = { 'Content-Type': 'application/json' };

// Forwards the lead to whatever is configured in LEAD_WEBHOOK_URL — point
// this at Zapier, Make, Airtable, HubSpot, or your own endpoint. Safe no-op
// when unset, so the base app never requires a paid service to run.
async function forwardToWebhook(lead) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('LEAD_WEBHOOK_URL not configured — lead logged only:', lead);
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
    await forwardToWebhook(lead);
    // Always return success to the client once the lead is captured server
    // side — webhook delivery issues are logged, not surfaced to the user.
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
