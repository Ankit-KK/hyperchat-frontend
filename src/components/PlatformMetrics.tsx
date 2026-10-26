import { useEffect, useRef } from "react";
import "./PlatformMetrics.css";

// Owner-supplied snapshot. Replace these values when a new snapshot is approved.
// These are not connected to live telemetry.
export interface PlatformMetric {
  value: number;
  label: string;
  unit?: string;
}

const metrics: PlatformMetric[] = [
  { value: 12811, label: "Realtime interactions processed" },
  { value: 12767, label: "Live alerts delivered" },
  { value: 299, unit: "ms", label: "Average event latency" },
];

function RollingNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const formatted = value.toLocaleString("en-US");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animations: Animation[] = [];
    let played = false;
    const stop = () => {
      animations.forEach(animation => animation.cancel());
      animations = [];
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || played) return;
      played = true;
      observer.disconnect();
      if (preference.matches) return;
      animations = Array.from(element.querySelectorAll<HTMLElement>(".metric-reel")).map((reel, index) =>
        reel.animate(
          [{ transform: "translateY(0)" }, { transform: reel.style.transform }],
          { duration: 1100 + index * 100, easing: "cubic-bezier(.16,1,.3,1)" },
        ),
      );
    }, { threshold: 0.6 });
    const onPreference = () => { if (preference.matches) stop(); };
    preference.addEventListener("change", onPreference);
    observer.observe(element);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", onPreference);
      stop();
    };
  }, [value]);

  return <span ref={ref} className="metric-number">
    <span className="sr-only">{formatted}</span>
    <span aria-hidden="true" className="metric-digits">
      {Array.from(formatted).map((character, index) => {
        if (!/\d/.test(character)) return <span key={index}>{character}</span>;
        const last = 20 + Number(character);
        return <span className="metric-digit" key={index}>
          <span className="metric-reel" style={{ transform: `translateY(-${last * 1.15}em)` }}>
            {Array.from({ length: last + 1 }, (_, digit) => <span key={digit}>{digit % 10}</span>)}
          </span>
        </span>;
      })}
    </span>
  </span>;
}

export default function PlatformMetrics({ values = metrics }: { values?: PlatformMetric[] }) {
  return (
    <section className="platform-metrics section-shell" aria-labelledby="metrics-title">
      <div className="metrics-heading">
        <h2 id="metrics-title">Small interactions. Real momentum.</h2>
        <span>PLATFORM SNAPSHOT</span>
      </div>
      <dl className="metrics-list">
        {values.map(({ value, unit, label }) => (
          <div className="metric" key={label}>
            <dt>{label}</dt>
            <dd><RollingNumber value={value} />{unit && <span className="metric-unit"> {unit}</span>}</dd>
          </div>
        ))}
      </dl>
      <p className="metrics-recognition">
        Built by Streamheart Private Limited, a <a href="/company#startup-recognition">DPIIT-recognised startup under Startup India</a>.
      </p>
    </section>
  );
}
