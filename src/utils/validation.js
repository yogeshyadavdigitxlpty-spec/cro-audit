export function isValidUrl(value) {
  if (!value || !value.trim()) return false;
  let candidate = value.trim();

  // Allow users to omit the protocol — quietly assume https for validation.
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    // Require at least one dot in the hostname (basic sanity check).
    if (!url.hostname.includes('.')) return false;
    return true;
  } catch {
    return false;
  }
}

export function isValidEmail(value) {
  if (!value || !value.trim()) return false;
  // Pragmatic email pattern — good enough for client-side UX validation.
  // The server performs its own authoritative check.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function validateHomeOrProductForm({ url }) {
  const errors = {};
  if (!url || !url.trim()) {
    errors.url = 'Enter a URL to continue.';
  } else if (!isValidUrl(url)) {
    errors.url = 'Enter a valid URL, e.g. https://yourbrand.com';
  }
  return errors;
}

export function validateFullSiteForm({ url, fullName, email, phone }) {
  const errors = {};

  if (!url || !url.trim()) {
    errors.url = 'Enter a URL to continue.';
  } else if (!isValidUrl(url)) {
    errors.url = 'Enter a valid URL, e.g. https://yourbrand.com';
  }

  if (!fullName || !fullName.trim()) {
    errors.fullName = 'Enter your full name.';
  }

  if (!email || !email.trim()) {
    errors.email = 'Enter your work email.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address.';
  }

  // Phone is optional — only validate if the person typed something.
  if (phone && phone.trim() && phone.trim().length < 6) {
    errors.phone = 'Enter a valid phone number, or leave this blank.';
  }

  return errors;
}
