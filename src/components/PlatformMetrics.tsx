import "./PlatformMetrics.css";

// Owner-supplied snapshot. Replace these values when a new snapshot is approved.
// These are not connected to live telemetry.
const metrics = [
  { value: "12,811", label: "Realtime interactions processed" },
  { value: "12,767", label: "Live alerts delivered" },
  { value: "299", unit: "ms", label: "Average event latency" },
];

export default function PlatformMetrics() {
  return (
    <section className="platform-metrics section-shell" aria-labelledby="metrics-title">
      <div className="metrics-heading">
        <h2 id="metrics-title">Small interactions. Real momentum.</h2>
        <span>PLATFORM SNAPSHOT</span>
      </div>
      <dl className="metrics-list">
        {metrics.map(({ value, unit, label }) => (
          <div className="metric" key={label}>
            <dt>{label}</dt>
            <dd>{value}{unit && <span className="metric-unit"> {unit}</span>}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
