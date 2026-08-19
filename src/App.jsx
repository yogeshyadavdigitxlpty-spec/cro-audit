import AuditSection from './components/AuditSection';
import { useIframeAutoResize } from './utils/useIframeAutoResize';

export default function App() {
  useIframeAutoResize();

  return (
    <main className="page">
      <AuditSection />
    </main>
  );
}
