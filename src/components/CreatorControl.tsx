import { ShieldCheck, SlidersHorizontal, Users, Check } from "lucide-react";
export default function CreatorControl({ home = false }: { home?: boolean }) {
  return (
    <section
      className="control section-shell"
      id="control"
      aria-labelledby="control-title"
    >
      <div className="section-label">
        <span>
          {home ? "04 / YOUR SPACE, YOUR SAY" : "03 / YOUR SPACE, YOUR SAY"}
        </span>
        <span>SAFETY & CONTROL</span>
      </div>
      <div className="control-grid">
        <div data-reveal>
          <ShieldCheck className="control-icon" size={42} strokeWidth={1} />
          <h2 id="control-title">
            Keep the energy.
            <br />
            <em>Set the boundaries.</em>
          </h2>
          <p>
            Your community has its own rhythm.
            <br />
            Choose how interactions reach your stream.
          </p>
        </div>
        <div className="control-list">
          <article data-reveal>
            <SlidersHorizontal size={22} />
            <div>
              <h3>Review before the spotlight.</h3>
              <p>
                Choose manual review or automatic approval. Hide messages and
                manage the moderation queue.
              </p>
            </div>
          </article>
          <article data-reveal>
            <Users size={22} />
            <div>
              <h3>Make room for your team.</h3>
              <p>
                Manage moderator permissions and viewer restrictions with
                controls scoped to your creator account.
              </p>
            </div>
          </article>
          <article data-reveal>
            <Check size={22} />
            <div>
              <h3>Keep access in your hands.</h3>
              <p>
                Manage your OBS connection tokens and revoke access when your
                setup changes.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
