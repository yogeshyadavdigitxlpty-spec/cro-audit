import { iconMap } from '../utils/icons';

export default function DeliverableItem({ icon, title, description }) {
  const Icon = iconMap[icon];

  return (
    <li className="deliverable-item">
      <span className="deliverable-item__icon" aria-hidden="true">
        {Icon ? <Icon size={16} /> : null}
      </span>
      <div>
        <p className="deliverable-item__title">{title}</p>
        <p className="deliverable-item__desc">{description}</p>
      </div>
    </li>
  );
}
