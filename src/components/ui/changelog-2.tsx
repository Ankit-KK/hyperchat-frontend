import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { websiteUpdates, type ChangeType } from "../../data/updates";
import "./changelog-2.css";

const filters = ["All", "Added", "Improved", "Fixed"] as const;
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
});

/** Adapted from the supplied changelog: dated rows, type labels and filtering. */
export default function ChangelogBlock() {
  const [filter, setFilter] = useState<"All" | ChangeType>("All");
  const entries = websiteUpdates.filter(entry => filter === "All" || entry.type === filter);
  return (
    <section className="section-shell light updates" aria-labelledby="updates-heading">
      <div className="updates-toolbar">
        <h2 id="updates-heading">The update log</h2>
        <span className="updates-scope">WEBSITE & INTERACTIVE PREVIEWS</span>
      </div>
      <div className="updates-filters" role="group" aria-label="Filter updates">
        {filters.map(type => (
          <button key={type} type="button" aria-pressed={filter === type}
            aria-controls="update-list" onClick={() => setFilter(type)}>
            {type}<span aria-hidden="true">{type === "All" ? websiteUpdates.length : websiteUpdates.filter(entry => entry.type === type).length}</span>
          </button>
        ))}
      </div>
      <p className="updates-count" role="status" aria-live="polite" aria-atomic="true">
        {entries.length} {filter === "All" ? "website updates" : `${filter.toLowerCase()} ${entries.length === 1 ? "update" : "updates"}`}
      </p>
      <ol id="update-list" className="updates-list">
        {entries.map(entry => (
          <li key={entry.id}>
            <article className="update-entry" aria-labelledby={`${entry.id}-title`}>
              <div className="update-meta">
                <time dateTime={entry.date}>{dateFormatter.format(new Date(`${entry.date}T00:00:00Z`))}</time>
                <span className={`update-type update-type--${entry.type.toLowerCase()}`}>{entry.type}</span>
              </div>
              <div className="update-copy">
                <h3 id={`${entry.id}-title`}>{entry.title}</h3>
                <p>{entry.description}</p>
                <a href={entry.href}>{entry.linkLabel}<ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
            </article>
          </li>
        ))}
      </ol>
      <div className="updates-note">
        <p>Small details make a better live experience.</p>
        <a href="mailto:ankit@hyperchat.space?subject=HyperChat%20website%20feedback">Tell us what could be better <ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
}
