import { useEffect } from 'react';
import { Lock } from 'lucide-react';
import DeviceToggle from './DeviceToggle';
import FormMessage from './FormMessage';
import LoadingState from './LoadingState';
import AuditResults from './AuditResults';
import { auditContent, AUDIT_TYPES } from '../data/auditConfig';
import { useSimpleAuditForm } from '../utils/useSimpleAuditForm';

export default function HomeAuditForm({ onResultsChange }) {
  const content = auditContent[AUDIT_TYPES.home];
  const { url, setUrl, device, setDevice, errors, status, serverError, result, handleSubmit, reset } =
    useSimpleAuditForm(AUDIT_TYPES.home);

  const hasResults = status === 'success' && Boolean(result);

  useEffect(() => {
    onResultsChange?.(hasResults ? result : null);
  }, [hasResults, result, onResultsChange]);

  if (status === 'loading') return <LoadingState />;
  if (hasResults) return <AuditResults result={result} onReset={reset} />;

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
          <label className="field-label" htmlFor="home-url">
            {content.fieldLabel}
          </label>
          <input
            id="home-url"
            className="field-input"
            type="text"
            inputMode="url"
            placeholder={content.placeholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-invalid={Boolean(errors.url)}
            aria-describedby={errors.url ? 'home-url-error' : undefined}
          />
          {errors.url && (
            <span className="field-error" id="home-url-error">
              {errors.url}
            </span>
          )}
        </div>

        <DeviceToggle value={device} onChange={setDevice} />

        <button type="submit" className="btn btn--primary" disabled={status === 'loading'}>
          {status === 'loading' && <span className="spinner" aria-hidden="true" />}
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
