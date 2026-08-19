import { useEffect, useState } from 'react';
import HomeAuditForm from './HomeAuditForm';
import ProductAuditForm from './ProductAuditForm';
import FullSiteAuditForm from './FullSiteAuditForm';
import AuditDeliverables from './AuditDeliverables';
import RecommendedActionsPanel from './RecommendedActionsPanel';
import { auditContent, AUDIT_TYPES } from '../data/auditConfig';

const FORM_COMPONENTS = {
  [AUDIT_TYPES.home]: HomeAuditForm,
  [AUDIT_TYPES.product]: ProductAuditForm,
  [AUDIT_TYPES.full]: FullSiteAuditForm,
};

export default function AuditPanel({ activeId }) {
  const FormComponent = FORM_COMPONENTS[activeId];
  const content = auditContent[activeId];

  // Keeps the same two-panel layout in both states: left panel is the
  // form (then score + key findings once results come in), right panel is
  // the static "what you'll receive" copy (then real recommended actions
  // once there's a result to show).
  const [result, setResult] = useState(null);

  // Reset whenever the person switches audit tabs, so leftover state from
  // one tab doesn't leak into another.
  useEffect(() => {
    setResult(null);
  }, [activeId]);

  return (
    <div className="audit-panel">
      <div className="panel">
        <FormComponent onResultsChange={setResult} />
      </div>
      {result ? (
        <RecommendedActionsPanel recommendations={result.recommendations} />
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
