import { useEffect } from 'react';
import { Lock } from 'lucide-react';
import DeviceToggle from './DeviceToggle';
import FormMessage from './FormMessage';
import { auditContent, AUDIT_TYPES } from '../data/auditConfig';
import { useSimpleAuditForm } from '../utils/useSimpleAuditForm';

export default function ProductAuditForm({ onStateChange }) {
  const content = auditContent[AUDIT_TYPES.product];
  const { url, setUrl, device, setDevice, errors, status, serverError, result, handleSubmit, reset } =
    useSimpleAuditForm(AUDIT_TYPES.product);

  // Report status/result/reset up to AuditPanel, which decides what to show
  // in the right-hand results slot. This input and button stay mounted and
  // visible the entire time - idle, loading, success, error - instead of
  // being replaced by the results screen.
  useEffect(() => {
    onStateChange?.({ status, result, reset });
  }, [status, result, reset, onStateChange]);

  const isLoading = status === 'loading';

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
          <label className="field-label" htmlFor="product-url">
            {content.fieldLabel}
          </label>
          <input
            id="product-url"
            className="field-input"
            type="text"
            inputMode="url"
            placeholder={content.placeholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-invalid={Boolean(errors.url)}
            aria-describedby={errors.url ? 'product-url-error' : undefined}
            disabled={isLoading}
          />
          {errors.url && (
            <span className="field-error" id="product-url-error">
              {errors.url}
            </span>
          )}
        </div>

        <DeviceToggle value={device} onChange={setDevice} disabled={isLoading} />

        <button type="submit" className="btn btn--primary" disabled={isLoading}>
          {isLoading && <span className="spinner" aria-hidden="true" />}
          {content.ctaLabel}
        </button>

        <p className="support-text">
          <Lock size={13} />
          {content.supportText}
        </p>
      </form>
    </>
  );
}

