import { useState } from 'react';
import AuditSelector from './AuditSelector';
import AuditPanel from './AuditPanel';
import { AUDIT_TYPES } from '../data/auditConfig';

export default function AuditSection() {
  const [activeId, setActiveId] = useState(AUDIT_TYPES.home);

  return (
    <section className="audit-section" aria-label="Website Conversion Audit">
      <div className="audit-section__header">
        <p className="audit-section__eyebrow">Choose Your Audit</p>
        <p className="audit-section__intro">
          Start with a fast AI-powered page review or request a deeper human-led audit across your complete
          customer journey.
        </p>
      </div>

      <div className="audit-card">
        <AuditSelector activeId={activeId} onSelect={setActiveId} />
        <AuditPanel activeId={activeId} />
      </div>
    </section>
  );
}
