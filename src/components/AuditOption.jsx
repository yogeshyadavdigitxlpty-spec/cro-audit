export default function AuditOption({ option, isActive, onSelect }) {
  return (
    <button
      type="button"
      className="audit-option"
      aria-pressed={isActive}
      onClick={() => onSelect(option.id)}
    >
      <div className="audit-option__top">
        <p className="audit-option__title">{option.title}</p>
        <span className={`badge badge--${option.badge.tone}`}>{option.badge.label}</span>
      </div>
      <p className="audit-option__desc">{option.cardDescription}</p>
    </button>
  );
}
