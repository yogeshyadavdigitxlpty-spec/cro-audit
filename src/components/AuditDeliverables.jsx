import DeliverableItem from './DeliverableItem';

export default function AuditDeliverables({ eyebrow, items, footerText }) {
  return (
    <div className="panel">
      <p className="panel__eyebrow">{eyebrow}</p>
      <ul className="deliverables">
        {items.map((item) => (
          <DeliverableItem key={item.title} {...item} />
        ))}
      </ul>
      <p className="panel__footer">{footerText}</p>
    </div>
  );
}
