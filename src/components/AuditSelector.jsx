import AuditOption from './AuditOption';
import { auditOptions } from '../data/auditConfig';

export default function AuditSelector({ activeId, onSelect }) {
  return (
    <div className="audit-selector" role="tablist" aria-label="Choose an audit type">
      {auditOptions.map((option) => (
        <AuditOption key={option.id} option={option} isActive={activeId === option.id} onSelect={onSelect} />
      ))}
    </div>
  );
}
