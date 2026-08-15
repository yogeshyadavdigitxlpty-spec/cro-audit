const { validateAuditRequest, normalizeUrl } = require('./utils/validate');
const { generateAuditJson } = require('./utils/aiProvider');

const JSON_HEADERS = { 'Content-Type': 'application/json' };
const FETCH_TIMEOUT_MS = 8000;

// Best-effort fetch of the target page so the AI has real context to work
// with. This is intentionally defensive: audits must still work even when
// the target blocks bots, times out, or errors.
async function fetchPageSnapshot(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'DIGITXL-Audit-Bot/1.0 (+https://digitxl.com)' },
    });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();
    // Strip tags/scripts down to a rough text snapshot, capped for prompt size.
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return text.slice(0, 4000);
  } catch {
    return null; // Network failure / timeout — audit continues without it.
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

  // Optional lightweight shared-secret check to slow down casual abuse of
  // a public endpoint. No-op if AUDIT_SHARED_SECRET isn't configured.
  const sharedSecret = process.env.AUDIT_SHARED_SECRET;
  if (sharedSecret && event.headers?.['x-audit-key'] !== sharedSecret) {
    return { statusCode: 401, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Unauthorized.' }) };
  }

  const errors = validateAuditRequest(body);
  if (errors.length > 0) {
    return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: errors.join(' ') }) };
  }

  const url = normalizeUrl(body.url);
  const device = body.device === 'mobile' ? 'mobile' : 'desktop';

  try {
    const pageSnapshot = await fetchPageSnapshot(url);
    const result = await generateAuditJson({ auditType: body.auditType, url, device, pageSnapshot });

    return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify(result) };
  } catch (err) {
    console.error('Audit function failed:', err);
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({ error: 'We could not complete the audit. Please try again shortly.' }),
    };
  }
};
