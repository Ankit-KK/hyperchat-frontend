// Tear geometry adapted from the owner-supplied Pushpin Tear Footer by kedhareswer.
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import "./pushpin-tear-footer.css";

// #region tear
export type Flap = {
  at: number;
  span: number;
  len: number;
  skew: number;
  dir: number;
  jag: number[];
};
export type Tear = {
  ys: number[];
  rim: number[];
  lag: number[];
  flaps: Flap[];
};

export const RIDGE_N = 84;
/** Off-screen start: the ridge begins below the bottom edge, so the sheet is whole. */
export const START = 1.06;
export const FLAPS = 6;

const clamp01 = (v: number) =>
  Number.isFinite(v) ? (v < 0 ? 0 : v > 1 ? 1 : v) : 0;

/** mulberry32 — small, seedable, the same tear for the same seed everywhere. */
export function rng(seed: number) {
  let a = (Number.isFinite(seed) ? Math.floor(seed) : 0) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ridge x positions, shared by every seed so one tear can morph into another. */
export const XS: number[] = (() => {
  const r = rng(911);
  const out: number[] = [];
  for (let i = 0; i < RIDGE_N; i++) {
    const u = i / (RIDGE_N - 1);
    const j = i > 0 && i < RIDGE_N - 1 ? (r() - 0.5) * (0.8 / RIDGE_N) : 0;
    out.push(-0.02 + u * 1.04 + j);
  }
  return out;
})();

/** The lowest the ridge may climb at x, so it never crosses the poster's content. */
export function ridgeFloor(x: number) {
  const d = Math.abs(x - 0.5);
  if (d < 0.13) return 0.39;
  if (d < 0.25) return 0.43;
  return 0.5;
}

export function makeTear(seed: number, n = RIDGE_N): Tear {
  const r = rng(seed);
  const ph = [r() * 6.283, r() * 6.283, r() * 6.283];
  const ys: number[] = [];
  const rim: number[] = [];
  const lag: number[] = [];
  for (let i = 0; i < n; i++) {
    const x = XS[Math.min(i, XS.length - 1)];
    const d = Math.min(1, Math.abs(x - 0.5) * 2);
    // a mountain: lowest under the pin, falling away to both edges
    const base = 0.43 + 0.3 * Math.pow(d, 1.35);
    const wander =
      (0.022 * Math.sin(x * 7 + ph[0]) +
        0.016 * Math.sin(x * 13 + ph[1]) +
        0.01 * Math.sin(x * 29 + ph[2])) *
      (0.45 + 0.55 * d);
    const spike = r() < 0.16 ? 2.3 : 1;
    const jag = (r() - 0.5) * 0.022 * spike;
    ys.push(Math.min(0.8, Math.max(ridgeFloor(x), base + wander + jag)));
    rim.push(1.2 + r() * 3.6);
    // rips from the pin outwards
    lag.push(
      Math.min(
        0.48,
        d * 0.4 + 0.04 + 0.03 * Math.sin(x * 23 + ph[1]) + r() * 0.012,
      ),
    );
  }
  // Six flaps: the outer two big curls, two mid, two small ones curling back over the sheet.
  const slots = [0.05, 0.19, 0.33, 0.67, 0.81, 0.95];
  const up = r() < 0.5 ? [2, 4] : [1, 3];
  const flaps: Flap[] = slots.map((slot, k) => {
    const x = slot + (r() - 0.5) * 0.05;
    const span = 3 + Math.floor(r() * 5);
    const at = Math.max(0, Math.min(n - 1 - span, Math.round(x * (n - 1))));
    const dir = up.includes(k) ? -1 : 1;
    const outer = k === 0 || k === slots.length - 1;
    const len =
      dir < 0
        ? 0.022 + r() * 0.022
        : outer
          ? 0.085 + r() * 0.04
          : 0.045 + r() * 0.05;
    return {
      at,
      span,
      len,
      skew: (r() - 0.5) * 1.1,
      dir,
      jag: [r() - 0.5, r() - 0.5, r() - 0.5, r() - 0.5],
    };
  });
  return { ys, rim, lag, flaps };
}

/** Ease out with a small overshoot: the paper rips a hair too far and settles. */
export function easeTear(t: number) {
  const x = clamp01(t);
  if (x === 0 || x === 1) return x;
  const c1 = 0.9;
  return 1 + (c1 + 1) * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

const easeInOut = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/** The ridge during the opening rip, `t` in 0..1. */
export function introYs(tear: Tear, t: number) {
  return tear.ys.map(
    (y, i) => START + (y - START) * easeTear((t - tear.lag[i]) / 0.5),
  );
}

/** The ridge while one tear re-rips into the next, `t` in 0..1. */
export function morphYs(from: number[], to: Tear, t: number) {
  return to.ys.map((y, i) => {
    const a = from[i] ?? y;
    return a + (y - a) * easeInOut((t - to.lag[i] * 0.6) / 0.6);
  });
}

/** How far a flap has unfolded during the opening rip. */
export function flapOpen(tear: Tear, f: Flap, t: number) {
  return easeTear((t - tear.lag[f.at] - 0.18) / 0.32);
}

/** A flap: the ridge segment it hangs from, then two jagged free edges meeting at its tip. */
export function flapPoly(
  ys: number[],
  f: Flap,
  W: number,
  H: number,
  open: number,
) {
  const b = Math.min(ys.length - 1, f.at + f.span);
  const top: number[][] = [];
  for (let k = f.at; k <= b; k++) top.push([XS[k] * W, ys[k] * H]);
  const A = top[0];
  const B = top[top.length - 1];
  const mx = (A[0] + B[0]) / 2;
  const my = (A[1] + B[1]) / 2;
  const L = f.len * H * Math.max(0, open);
  const tip = [mx + f.skew * L, my + f.dir * L];
  const side = (P: number[], Q: number[], j0: number, j1: number) => {
    const dx = Q[0] - P[0];
    const dy = Q[1] - P[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    return [
      [P[0] + dx / 3 + nx * j0 * 0.22 * L, P[1] + dy / 3 + ny * j0 * 0.22 * L],
      [
        P[0] + (dx * 2) / 3 + nx * j1 * 0.22 * L,
        P[1] + (dy * 2) / 3 + ny * j1 * 0.22 * L,
      ],
    ];
  };
  return [
    ...top,
    ...side(B, tip, f.jag[0], f.jag[1]),
    tip,
    ...side(tip, A, f.jag[2], f.jag[3]),
  ];
}

const n1 = (v: number) => Math.round(v * 10) / 10;

export function polyD(pts: number[][]) {
  return pts.length
    ? "M" + pts.map((p) => n1(p[0]) + " " + n1(p[1])).join("L") + "Z"
    : "";
}

/** The sheet: everything above the ridge, lifted by `off` pixels per point (the fibre rim). */
export function sheetD(ys: number[], W: number, H: number, off?: number[]) {
  let d = "M-20 -20L" + (W + 20) + " -20";
  for (let i = ys.length - 1; i >= 0; i--)
    d += "L" + n1(XS[i] * W) + " " + n1(ys[i] * H - (off ? off[i] : 0));
  return d + "Z";
}

/** Mix two #rrggbb colours. */
export function mixHex(a: string, b: string, t: number) {
  const p = (h: string) => {
    const s = h.replace("#", "");
    const f =
      s.length === 3
        ? s
            .split("")
            .map((c) => c + c)
            .join("")
        : s.padEnd(6, "0").slice(0, 6);
    return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) || 0);
  };
  const x = p(a);
  const y = p(b);
  const k = clamp01(t);
  return (
    "#" +
    x
      .map((v, i) =>
        Math.round(v + (y[i] - v) * k)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

// #endregion

const EMAIL = "ankit@hyperchat.space";
const WIDTH = 1000;
const HEIGHT = 240;
const groups = [
  {
    title: "Explore",
    links: [
      ["Home", "/"],
      ["Features", "/features"],
      ["For creators", "/creators"],
    ],
  },
  {
    title: "Get in touch",
    links: [
      ["Company", "/company"],
      ["Support", "/support"],
      ["Email the team", `mailto:${EMAIL}`],
    ],
  },
  {
    title: "Policies",
    links: [
      ["Privacy", "https://www.hyperchat.space/privacy-policy"],
      ["Terms", "https://www.hyperchat.space/terms-and-conditions"],
      ["Refunds", "https://www.hyperchat.space/cancellation-refunds"],
    ],
  },
];

/** Natural-flow links stay outside the decorative tear so no content can be clipped. */
export default function PushpinTearFooter() {
  const footer = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const sheet = useRef<SVGPathElement>(null);
  const rim = useRef<SVGPathElement>(null);
  const flaps = useRef<(SVGPathElement | null)[]>([]);
  const raf = useRef(0);
  const reduced = useRef(false);
  const mounted = useRef(false);
  const started = useRef(false);
  const current = useRef(makeTear(23));
  const visibleYs = useRef(current.current.ys);
  const [pinRevision, setPinRevision] = useState(0);
  const seed = useRef(23);
  const [busy, setBusy] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId().replace(/:/g, "");

  const draw = useCallback((tear: Tear, ys: number[], progress: number) => {
    visibleYs.current = ys;
    art.current?.style.setProperty("--pin-y", `${ys[Math.floor(ys.length / 2)] * 100}%`);
    sheet.current?.setAttribute("d", sheetD(ys, WIDTH, HEIGHT, tear.rim));
    rim.current?.setAttribute("d", sheetD(ys, WIDTH, HEIGHT));
    tear.flaps.forEach((flap, index) => {
      flaps.current[index]?.setAttribute(
        "d",
        polyD(
          flapPoly(ys, flap, WIDTH, HEIGHT, flapOpen(tear, flap, progress)),
        ),
      );
    });
  }, []);

  const settle = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    draw(current.current, current.current.ys, 1);
    if (mounted.current) setBusy(false);
  }, [draw]);

  const animate = useCallback(
    (next: Tear, intro: boolean) => {
      cancelAnimationFrame(raf.current);
      const from = visibleYs.current;
      current.current = next;
      if (reduced.current || document.hidden) {
        settle();
        return;
      }
      setBusy(true);
      const begin = performance.now();
      const frame = (now: number) => {
        if (!mounted.current) return;
        const progress = Math.min(1, Math.max(0, now - begin - (intro ? 0 : 150)) / 850);
        draw(
          next,
          intro ? introYs(next, progress) : morphYs(from, next, progress),
          progress,
        );
        if (progress < 1) raf.current = requestAnimationFrame(frame);
        else {
          raf.current = 0;
          setBusy(false);
        }
      };
      raf.current = requestAnimationFrame(frame);
    },
    [draw, settle],
  );

  useEffect(() => {
    mounted.current = true;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      reduced.current = preference.matches;
      if (preference.matches) settle();
    };
    change();
    const visibility = () => {
      if (document.hidden) settle();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          animate(current.current, true);
        } else if (!entry.isIntersecting) settle();
      },
      { threshold: 0.1 },
    );
    observer.observe(art.current!);
    preference.addEventListener("change", change);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      mounted.current = false;
      cancelAnimationFrame(raf.current);
      if (timer.current) clearTimeout(timer.current);
      observer.disconnect();
      preference.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [animate, settle]);

  const repin = () => {
    started.current = true;
    seed.current++;
    setPinRevision(value => value + 1);
    animate(makeTear(seed.current), false);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      if (!mounted.current) return;
      setCopyStatus("Email copied.");
    } catch {
      if (!mounted.current) return;
      setCopyStatus("Could not copy. Use the email link instead.");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyStatus(""), 4500);
  };

  return (
    <footer ref={footer} className="tear-footer" aria-label="HyperChat footer">
      <div className="tear-footer-content">
        <div className="tear-footer-top">
          <a className="tear-footer-brand" href="/" aria-label="HyperChat V2 home">
            hyperchat <span>V2</span>
          </a>
          <a className="tear-footer-up" href="#main">
            Back to top <ArrowUp size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="tear-footer-grid">
          <div className="tear-footer-contact">
            <span className="eyebrow">YOUR NEXT CONVERSATION STARTS HERE</span>
            <h2>Let’s stay connected.</h2>
            <div className="tear-footer-email">
              <a href={`mailto:${EMAIL}`}>
                {EMAIL} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => void copy()}
                aria-label={`Copy ${EMAIL}`}
              >
                {copyStatus === "Email copied." ? (
                  <Check size={17} />
                ) : (
                  <Copy size={17} />
                )}
              </button>
            </div>
            <p role="status" className="tear-footer-status">
              {copyStatus}
            </p>
            <p className="tear-footer-company">
              HyperChat is a product of Streamheart Private Limited.
            </p>
          </div>
          {groups.map((group) => (
            <nav key={group.title} aria-label={`Footer ${group.title}`}>
              <h3>{group.title}</h3>
              <ul>
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div ref={art} className="tear-footer-art" data-animating={busy}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter
              id={`${id}-shadow`}
              x="-10%"
              y="-20%"
              width="120%"
              height="150%"
            >
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="3"
                floodColor="#221F1C"
                floodOpacity=".2"
              />
            </filter>
          </defs>
          <g filter={`url(#${id}-shadow)`}>
            <path
              ref={rim}
              d={sheetD(current.current.ys, WIDTH, HEIGHT)}
              fill="#D7CBB9"
            />
            <path
              ref={sheet}
              d={sheetD(current.current.ys, WIDTH, HEIGHT, current.current.rim)}
              fill="#221F1C"
            />
            {current.current.flaps.map((flap, index) => (
              <path
                key={index}
                ref={(el) => {
                  flaps.current[index] = el;
                }}
                d={polyD(flapPoly(current.current.ys, flap, WIDTH, HEIGHT, 1))}
                fill={index % 2 ? "#D7CBB9" : "#8C847B"}
              />
            ))}
          </g>
        </svg>
        <button
          className="tear-footer-pin"
          type="button"
          onClick={repin}
          aria-label="Re-pin: tear a new edge"
          title="Re-pin the paper"
        >
          <svg key={pinRevision} viewBox="0 0 100 140" aria-hidden="true">
            <ellipse cx="50" cy="133" rx="9" ry="3" fill="#221F1C" opacity=".22" />
            <path d="M47 96h6l-2 36-1 4-1-4z" fill="#8C847B" />
            <path d="M49 98h2v33h-1z" fill="#F3EDE2" />
            <path d="M23 85v9c0 12 54 12 54 0v-9z" fill="#704323" />
            <ellipse cx="50" cy="85" rx="27" ry="10" fill="#B8702F" />
            <path d="M38 39c2 13 6 23 3 31-3 6-12 10-14 16 10 9 36 9 46 0-2-6-11-10-14-16-3-8 1-18 3-31z" fill="#B8702F" />
            <path d="M54 42c-1 12-3 22 0 30 3 6 11 11 13 16l6-2c-2-6-11-10-14-16-3-8 1-18 3-31z" fill="#704323" />
            <path d="M12 24v15c0 20 76 20 76 0V24z" fill="#B8702F" />
            <path d="M66 27v23c12-2 22-6 22-11V24z" fill="#704323" />
            <ellipse cx="50" cy="24" rx="38" ry="15" fill="#B8702F" stroke="#D7CBB9" strokeWidth="1.2" />
            <path d="M21 22c8-9 31-12 46-5" fill="none" stroke="#D7CBB9" strokeWidth="3" strokeLinecap="round" />
            <path d="M20 38v5M43 52l2 13" stroke="#D7CBB9" strokeOpacity=".6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <span className="tear-footer-pin-hint">
          A SMALL INTERACTION. TRY THE PIN.
        </span>
      </div>
      <div className="tear-footer-bottom">
        <span>© {new Date().getFullYear()} HyperChat</span>
        <span>CREATOR TOOLS. HUMAN CONNECTION.</span>
        <a href="/support">
          Here to help <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
