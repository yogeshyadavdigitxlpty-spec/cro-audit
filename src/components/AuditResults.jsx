export default function AuditResults({ result, onReset }) {
  const { score = 0, findings = [], recommendations = [] } = result || {};

  return (
    <div className="results">
      <div className="results__header">
        <div className="results__score-card">
          <div className="results__score-ring" style={{ '--score': score }}>
            <span>{score}</span>
          </div>
          <div>
            <p className="results__score-title">Conversion score</p>
            <p className="results__score-label">Out of 100, based on CRO heuristics</p>
          </div>
        </div>
        <button type="button" className="results__reset" onClick={onReset}>
          Run another audit
        </button>
      </div>

      <div>
        <p className="results-section-title">Key findings</p>
        <ul className="finding-list">
          {findings.map((finding, index) => (
            <li className="finding-item" key={index}>
              <span className={`severity-pill severity-pill--${finding.severity || 'medium'}`}>
                {finding.severity || 'medium'}
              </span>
              <div>
                <p className="finding-item__title">{finding.title}</p>
                <p className="finding-item__desc">{finding.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="results-section-title">Recommended actions</p>
        <ul className="finding-list">
          {recommendations.map((rec, index) => (
            <li className="finding-item" key={index}>
              <span className="severity-pill severity-pill--low">Action</span>
              <div>
                <p className="finding-item__title">{rec.title}</p>
                <p className="finding-item__desc">{rec.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
