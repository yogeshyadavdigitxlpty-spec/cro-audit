import { useState } from 'react';
import { validateHomeOrProductForm } from './validation';
import { runAudit, ApiError } from './api';

// Shared behaviour for the Home Page Audit and Product Page Audit forms:
// both only ever collect a URL + device, run the same validation, and
// call the same endpoint with a different `auditType`. Keeping this in one
// hook means HomeAuditForm / ProductAuditForm stay focused on markup.
export function useSimpleAuditForm(auditType) {
  const [url, setUrl] = useState('');
  const [device, setDevice] = useState('desktop');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');
  const [result, setResult] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'loading') return; // prevent duplicate submissions

    const validationErrors = validateHomeOrProductForm({ url });
    setErrors(validationErrors);
    setServerError('');

    if (Object.keys(validationErrors).length > 0) return;

    setStatus('loading');
    try {
      const data = await runAudit({ auditType, url, device });
      setResult(data);
      setStatus('success');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
      setServerError(message);
      setStatus('error');
    }
  }

  function reset() {
    setResult(null);
    setStatus('idle');
    setServerError('');
    setUrl('');
  }

  return {
    url,
    setUrl,
    device,
    setDevice,
    errors,
    status,
    serverError,
    result,
    handleSubmit,
    reset,
  };
}
