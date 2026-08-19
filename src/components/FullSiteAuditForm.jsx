import { useState } from 'react';
import { Lock, CheckCircle2, ExternalLink } from 'lucide-react';
import FormMessage from './FormMessage';
import { auditContent, AUDIT_TYPES } from '../data/auditConfig';
import { validateFullSiteForm } from '../utils/validation';
import { submitLead, ApiError } from '../utils/api';

const initialValues = { url: '', fullName: '', email: '', phone: '' };

// Set this in your .env / Netlify env vars to swap the built-in lead form
// for an embedded Contact Form 7 page. Leave it unset to keep the
// built-in form (useful for local dev without a CF7 page to point at).
const CF7_FULL_AUDIT_URL = import.meta.env.VITE_CF7_FULL_AUDIT_URL;

export default function FullSiteAuditForm() {
  if (CF7_FULL_AUDIT_URL) {
    return <Cf7EmbeddedForm src={CF7_FULL_AUDIT_URL} />;
  }
  return <BuiltInFullSiteAuditForm />;
}

function Cf7EmbeddedForm({ src }) {
  const content = auditContent[AUDIT_TYPES.full];

  return (
    <>
      <p className="panel__eyebrow">{content.eyebrow}</p>
      <h2 className="panel__heading">
        {content.heading.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < content.heading.split('\n').length - 1 && <br />}
          </span>
        ))}
      </h2>
      <p className="panel__description">{content.description}</p>

      <iframe
        src={src}
        title="Full Site Audit request form"
        className="cf7-embed-frame"
        loading="lazy"
      />

      <p className="support-text">
        Form not showing?{' '}
        <a href={src} target="_blank" rel="noopener noreferrer">
          Open it in a new tab <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
        </a>
      </p>
    </>
  );
}

function BuiltInFullSiteAuditForm() {
  const content = auditContent[AUDIT_TYPES.full];
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'loading') return;

    const validationErrors = validateFullSiteForm(values);
    setErrors(validationErrors);
    setServerError('');

    if (Object.keys(validationErrors).length > 0) return;

    setStatus('loading');
    try {
      await submitLead(values);
      setStatus('success');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
      setServerError(message);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 12px' }}>
        <CheckCircle2 size={36} color="#1f7a43" style={{ marginBottom: 16 }} />
        <h2 className="panel__heading" style={{ fontSize: 22 }}>
          Request received.
        </h2>
        <p className="panel__description">
          A DIGITXL strategist will review your site and reach out within one business day to confirm scope
          and next steps.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="panel__eyebrow">{content.eyebrow}</p>
      <h2 className="panel__heading">
        {content.heading.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < content.heading.split('\n').length - 1 && <br />}
          </span>
        ))}
      </h2>
      <p className="panel__description">{content.description}</p>

      <form onSubmit={handleSubmit} noValidate>
        <FormMessage type="error">{serverError}</FormMessage>

        <div className="field-group">
          <label className="field-label" htmlFor="full-url">
            Website URL
          </label>
          <input
            id="full-url"
            className="field-input"
            type="text"
            inputMode="url"
            placeholder="https://yourbrand.com"
            value={values.url}
            onChange={(e) => updateField('url', e.target.value)}
            aria-invalid={Boolean(errors.url)}
            aria-describedby={errors.url ? 'full-url-error' : undefined}
          />
          {errors.url && (
            <span className="field-error" id="full-url-error">
              {errors.url}
            </span>
          )}
        </div>

        <div className="field-row">
          <div className="field-group">
            <label className="field-label" htmlFor="full-name">
              Full Name
            </label>
            <input
              id="full-name"
              className="field-input"
              type="text"
              placeholder="Jane Whitfield"
              value={values.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'full-name-error' : undefined}
            />
            {errors.fullName && (
              <span className="field-error" id="full-name-error">
                {errors.fullName}
              </span>
            )}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="work-email">
              Work Email
            </label>
            <input
              id="work-email"
              className="field-input"
              type="email"
              placeholder="jane@company.com"
              value={values.email}
              onChange={(e) => updateField('email', e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'work-email-error' : undefined}
            />
            {errors.email && (
              <span className="field-error" id="work-email-error">
                {errors.email}
              </span>
            )}
          </div>
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="phone">
            Phone Number (Optional)
          </label>
          <input
            id="phone"
            className="field-input"
            type="tel"
            placeholder="+61 400 000 000"
            value={values.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <span className="field-error" id="phone-error">
              {errors.phone}
            </span>
          )}
        </div>

        <button type="submit" className="btn btn--primary" disabled={status === 'loading'}>
          {status === 'loading' && <span className="spinner" aria-hidden="true" />}
          {content.ctaLabel}
        </button>

        <p className="support-text">
          <Lock size={13} />
          {content.supportText}
        </p>

        <p className="pricing-line">
          {content.pricingLine.prefix}
          <strong>{content.pricingLine.amount}</strong>
          {content.pricingLine.suffix}
        </p>
      </form>
    </>
  );
}
