import { useEffect, useState } from 'react';
import HomeAuditForm from './HomeAuditForm';
import ProductAuditForm from './ProductAuditForm';
import FullSiteAuditForm from './FullSiteAuditForm';
import AuditDeliverables from './AuditDeliverables';
import AuditResults from './AuditResults';
import LoadingState from './LoadingState';
import { auditContent, AUDIT_TYPES } from '../data/auditConfig';

const FORM_COMPONENTS = {
  [AUDIT_TYPES.home]: HomeAuditForm,
  [AUDIT_TYPES.product]: ProductAuditForm,
  [AUDIT_TYPES.full]: FullSiteAuditForm,
};

const initialAuditState = { status: 'idle', result: null, reset: null };

export default function AuditPanel({ activeId }) {
  const FormComponent = FORM_COMPONENTS[activeId];
  const content = auditContent[activeId];

  // The right-hand column starts as the static "what you'll receive" copy
  // (the default placeholder) and only swaps to the live AuditResults once
  // a request actually succeeds. The left-hand form is never replaced or
  // hidden - it stays mounted and visible through idle, loading, success,
  // and error states, so the URL input is always there for the person to
  // see/edit.
  const [auditState, setAuditState] = useState(initialAuditState);

  // Reset whenever the person switches audit tabs, so leftover state from
  // one tab doesn't leak into another.
  useEffect(() => {
    setAuditState(initialAuditState);
  }, [activeId]);

  const { status, result, reset } = auditState;
  const isLoading = status === 'loading';
  const hasResults = status === 'success' && Boolean(result);

  return (
    <div className="audit-panel">
      <div className="panel">
        <FormComponent onStateChange={setAuditState} />
      </div>

      {isLoading ? (
        <div className="panel">
          <LoadingState />
        </div>
      ) : hasResults ? (
        <div className="panel">
          <AuditResults result={result} onReset={reset} />
        </div>
      ) : (
        <AuditDeliverables
          eyebrow={content.deliverablesEyebrow}
          items={content.deliverables}
          footerText={content.footerText}
        />
      )}
    </div>
  );
}

