// Server-side validation. Never trust the client — this re-checks
// everything the browser already checked before any further processing.

function isValidUrl(value) {
  if (!value || typeof value !== 'string') return false;
  let candidate = value.trim();
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }
  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    if (!url.hostname.includes('.')) return false;
    return true;
  } catch {
    return false;
  }
}

function isValidEmail(value) {
  if (!value || typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

function validateAuditRequest(body) {
  const errors = [];
  const validTypes = ['home', 'product'];

  if (!body || typeof body !== 'object') {
    return ['Invalid request body.'];
  }

  if (!validTypes.includes(body.auditType)) {
    errors.push('auditType must be one of: home, product.');
  }

  if (!isValidUrl(body.url)) {
    errors.push('A valid url is required.');
  }

  if (body.device && !['desktop', 'mobile'].includes(body.device)) {
    errors.push('device must be either desktop or mobile.');
  }

  return errors;
}

function validateLeadRequest(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return ['Invalid request body.'];
  }

  if (!isValidUrl(body.url)) {
    errors.push('A valid website url is required.');
  }

  if (!body.fullName || !String(body.fullName).trim()) {
    errors.push('fullName is required.');
  }

  if (!isValidEmail(body.email)) {
    errors.push('A valid email is required.');
  }

  if (body.phone && String(body.phone).trim().length > 0 && String(body.phone).trim().length < 6) {
    errors.push('phone must be a valid phone number if provided.');
  }

  return errors;
}

module.exports = {
  isValidUrl,
  isValidEmail,
  normalizeUrl,
  validateAuditRequest,
  validateLeadRequest,
};
