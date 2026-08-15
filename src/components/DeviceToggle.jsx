import { Monitor, Smartphone } from 'lucide-react';

const OPTIONS = [
  { id: 'desktop', label: 'Desktop', Icon: Monitor },
  { id: 'mobile', label: 'Mobile', Icon: Smartphone },
];

export default function DeviceToggle({ value, onChange, disabled }) {
  return (
    <div className="field-group">
      <span className="field-label" id="device-toggle-label">
        Device
      </span>
      <div className="device-toggle" role="group" aria-labelledby="device-toggle-label">
        {OPTIONS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className="device-toggle__option"
            aria-pressed={value === id}
            disabled={disabled}
            onClick={() => onChange(id)}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
