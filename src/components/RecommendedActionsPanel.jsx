export default function RecommendedActionsPanel({ recommendations = [] }) {
  return (
    <div className="panel">
      <p className="panel__eyebrow">Recommended actions</p>
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
      <p className="panel__footer">
        Work through these in order — each one is picked to move the conversion score the most for the least
        effort.
      </p>
    </div>
  );
}
