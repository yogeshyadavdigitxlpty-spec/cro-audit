import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { loadingSteps } from '../data/auditConfig';

export default function LoadingState() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-state__ring" aria-hidden="true" />
      <p className="loading-state__title">Running your audit…</p>
      <div className="loading-state__steps">
        {loadingSteps.map((step, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;
          return (
            <div
              key={step}
              className={`loading-state__step ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
            >
              {isDone ? <CheckCircle2 size={14} /> : <span style={{ width: 14 }} />}
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
}
