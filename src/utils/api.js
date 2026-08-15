// Thin wrapper around fetch so components never talk to endpoints directly.
// Swapping hosting providers (Netlify -> Vercel -> Cloudflare) only means
// changing these two paths.

const AUDIT_ENDPOINT = '/.netlify/functions/audit';
const LEAD_ENDPOINT = '/.netlify/functions/lead';

async function postJson(endpoint, payload) {
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError('network', 'We could not reach the server. Check your connection and try again.');
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON response — fall through to status handling below.
  }

  if (!response.ok) {
    const message = data?.error || 'Something went wrong. Please try again.';
    if (response.status === 408 || response.status === 504) {
      throw new ApiError('timeout', 'The request timed out. Please try again.');
    }
    throw new ApiError('server', message);
  }

  return data;
}

export class ApiError extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind;
  }
}

export function runAudit({ auditType, url, device }) {
  return postJson(AUDIT_ENDPOINT, { auditType, url, device });
}

export function submitLead({ url, fullName, email, phone }) {
  return postJson(LEAD_ENDPOINT, { url, fullName, email, phone });
}
