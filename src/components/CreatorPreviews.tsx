import { useEffect, useRef, useState } from "react";
import {
  AudioLines,
  Check,
  Download,
  EyeOff,
  Heart,
  Play,
  RotateCcw,
  Search,
  Square,
} from "lucide-react";
import { demoInteractions, formatAmount } from "../data/demo";
import { useVoicePreview } from "../hooks/useVoicePreview";

function VoicePreview() {
  const { availability, isPlaying, notice, play, stop } = useVoicePreview();
  return (
    <div className="voice-preview">
      <div className="support-message">
        <AudioLines size={26} aria-hidden="true" />
        <span>
          “This made my evening. Keep creating!”
          <small>Ari · example viewer · device-generated voice</small>
        </span>
      </div>
      <div className="voice-preview-controls">
        <button
          className="icon-text-button"
          onClick={isPlaying ? stop : play}
          disabled={availability !== "ready" && !isPlaying}
        >
          {isPlaying ? <Square size={12} /> : <Play size={12} />}
          {isPlaying ? "Stop voice preview" : "Play voice preview"}
        </button>
        <p className="tool-note" role="status">
          {notice}
        </p>
      </div>
    </div>
  );
}

export function SupportPreview() {
  const [kind, setKind] = useState("Message");
  return (
    <div className="tool-preview support-tool">
      <div className="tool-heading">
        <h3>Ari’s interaction</h3>
        <span>FICTIONAL EXAMPLE</span>
      </div>
      <div className="interaction-preview-title">
        A message.
        <br />A moment.
      </div>
      <div
        className="segmented-control"
        role="group"
        aria-label="Example interaction type"
      >
        {["Message", "Text-to-speech"].map((type) => (
          <button
            key={type}
            aria-pressed={kind === type}
            onClick={() => setKind(type)}
          >
            {type}
          </button>
        ))}
      </div>
      {kind === "Text-to-speech" ? (
        <VoicePreview />
      ) : (
        <div className="support-message">
          <span className="small-avatar">A</span>
          <span>
            “This made my evening. Keep creating!”
            <small>Ari · example viewer</small>
          </span>
        </div>
      )}
      <div className="tool-note">
        <Heart size={13} /> A familiar name. A personal touch.
      </div>
    </div>
  );
}

export function AlertPreview() {
  const [scale, setScale] = useState(1);
  return (
    <div className="tool-preview alert-tool">
      <div className="tool-heading">
        <h3>Alert appearance</h3>
        <span>LOCAL PREVIEW</span>
      </div>
      <div className="overlay-boundary">
        <span className="overlay-guide">YOUR BROADCAST AREA</span>
        <div className="sample-alert" style={{ transform: `scale(${scale})` }}>
          <Heart size={20} />
          <div>
            <span>A MESSAGE FOR YOUR STREAM</span>
            <strong>Ari joined the moment</strong>
            <p>This made my evening.</p>
          </div>
        </div>
      </div>
      <div className="setting-row">
        <span>Overlay size</span>
        <div
          className="segmented-control"
          role="group"
          aria-label="Overlay size"
        >
          {[0.75, 1, 1.25].map((size) => (
            <button
              key={size}
              aria-pressed={scale === size}
              onClick={() => setScale(size)}
            >
              {size * 100}%
            </button>
          ))}
        </div>
      </div>
      <p className="tool-note">Try the scale. Only this example changes.</p>
    </div>
  );
}

const sounds = [
  { name: "Warm bell", frequencies: [523.25, 783.99], duration: "0.7 s" },
  { name: "Double tap", frequencies: [220, 330], duration: "0.7 s" },
  { name: "Soft chime", frequencies: [659.25, 987.77], duration: "0.7 s" },
];
export function SoundboardPreview() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [notice, setNotice] = useState(
    "Original example tones. Audio plays only when you press Play.",
  );
  const context = useRef<AudioContext | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const stop = () => {
    generation.current++;
    if (timer.current) clearTimeout(timer.current);
    const active = context.current;
    context.current = null;
    if (active && active.state !== "closed")
      void active.close().catch(() => {});
    setPlaying(null);
  };
  useEffect(
    () => () => {
      generation.current++;
      if (timer.current) clearTimeout(timer.current);
      if (context.current && context.current.state !== "closed")
        void context.current.close().catch(() => {});
    },
    [],
  );
  const play = async (sound: (typeof sounds)[number]) => {
    stop();
    const version = generation.current;
    setPlaying(sound.name);
    try {
      const audio = new AudioContext();
      context.current = audio;
      await audio.resume();
      if (version !== generation.current || audio.state === "closed") return;
      sound.frequencies.forEach((frequency, i) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const start = audio.currentTime + i * 0.12;
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.055, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.55);
      });
      setNotice(`Playing ${sound.name}, a locally generated example.`);
      timer.current = setTimeout(() => {
        stop();
        setNotice(`${sound.name} finished. Choose another example.`);
      }, 750);
    } catch {
      stop();
      setNotice(
        "Audio is unavailable in this browser. The soundboard layout is still available to explore.",
      );
    }
  };
  return (
    <div className="tool-preview sound-tool">
      <div className="tool-heading">
        <h3>Your soundboard</h3>
        <span>3 EXAMPLE SOUNDS</span>
      </div>
      <div className="sound-list">
        {sounds.map((sound, i) => (
          <div className="sound-row" key={sound.name}>
            <span className="sound-index">0{i + 1}</span>
            <div>
              <strong>{sound.name}</strong>
              <small>Original preview tone · {sound.duration}</small>
            </div>
            <button
              className="round-tool-button"
              aria-label={`Play ${sound.name}`}
              disabled={playing !== null}
              onClick={() => void play(sound)}
            >
              <Play size={13} fill="currentColor" />
            </button>
          </div>
        ))}
      </div>
      <div className="sound-status">
        <p className="tool-note" role="status">
          {notice}
        </p>
        {playing && (
          <button
            className="icon-text-button"
            onClick={() => {
              stop();
              setNotice("Preview stopped.");
            }}
          >
            <Square size={12} />
            Stop sound
          </button>
        )}
      </div>
    </div>
  );
}

export function HistoryPreview() {
  const [query, setQuery] = useState("");
  const rows = demoInteractions.filter((row) =>
    `${row.name} ${row.kind} ${row.message}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  const exportCsv = () => {
    const csv =
      "viewer,interaction,status,time,support_inr\n" +
      rows
        .map(
          (row) =>
            `${row.name},${row.kind},${row.status},${row.time},${row.amount}`,
        )
        .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "hyperchat-fictional-interactions.csv";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="tool-preview history-tool">
      <div className="tool-heading">
        <h3>Interaction history</h3>
        <span>FICTIONAL RECORDS</span>
      </div>
      <div className="history-toolbar">
        <label className="search-field">
          <Search size={14} />
          <input
            type="search"
            aria-label="Filter example interactions"
            placeholder="Find a viewer or interaction"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button
          className="round-tool-button"
          aria-label="Export example CSV"
          onClick={exportCsv}
          disabled={!rows.length}
        >
          <Download size={15} />
        </button>
      </div>
      <div className="history-table-wrap">
        <table className="history-table">
          <caption className="sr-only">Fictional interaction history</caption>
          <thead>
            <tr>
              <th scope="col">Viewer</th>
              <th scope="col">Interaction</th>
              <th scope="col">Support</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.name}</strong>
                  <small>{row.time} · example</small>
                </td>
                <td>
                  {row.kind}
                  <small>{row.status}</small>
                </td>
                <td>{formatAmount(row.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <p className="empty-history" role="status">
            No example interactions match “{query}”.
          </p>
        )}
      </div>
      <div className="history-summary">
        <span>
          {rows.length} of {demoInteractions.length} examples
        </span>
        <span>Fictional interactions · local preview</span>
      </div>
    </div>
  );
}

type ReviewState = "pending" | "approved" | "hidden";
export function ModerationPreview() {
  const [states, setStates] = useState<Record<string, ReviewState>>({});
  const rows = demoInteractions.slice(0, 2);
  const pending = rows.filter(
    (row) => !states[row.id] || states[row.id] === "pending",
  ).length;
  const act = (id: string, status: ReviewState) =>
    setStates((previous) => ({ ...previous, [id]: status }));
  return (
    <div className="tool-preview moderation-tool">
      <div className="tool-heading">
        <h3>Review queue</h3>
        <span>{pending} PENDING · DEMO</span>
      </div>
      <div className="review-list">
        {rows.map((row) => {
          const state = states[row.id] ?? "pending";
          return (
            <article
              className="review-item"
              key={row.id}
              aria-label={`Example interaction from ${row.name}`}
            >
              <div className="review-meta">
                <strong>
                  {row.name}
                  <span>{row.kind} interaction</span>
                </strong>
                <span
                  className="review-status"
                  data-state={state}
                  role="status"
                >
                  {state}
                </span>
              </div>
              <p>
                {state === "hidden"
                  ? "Interaction hidden in this preview."
                  : `“${row.message}”`}
              </p>
              <div className="review-actions">
                {state === "pending" ? (
                  <>
                    <button onClick={() => act(row.id, "approved")}>
                      <Check size={13} />
                      Approve
                    </button>
                    <button onClick={() => act(row.id, "hidden")}>
                      <EyeOff size={13} />
                      Hide
                    </button>
                  </>
                ) : (
                  <button onClick={() => act(row.id, "pending")}>
                    <RotateCcw size={12} />
                    Undo
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <div className="review-footer">
        <span>Example actions stay in this browser.</span>
        <button className="icon-text-button" onClick={() => setStates({})}>
          Reset queue <RotateCcw size={12} />
        </button>
      </div>
    </div>
  );
}

export function ObsPreview() {
  const [alerts, setAlerts] = useState(true);
  const [audio, setAudio] = useState(true);
  return (
    <div className="tool-preview obs-tool">
      <div className="tool-heading">
        <h3>Broadcast sources</h3>
        <span>ILLUSTRATIVE OBS SETUP</span>
      </div>
      <div className="obs-layout">
        <div className="obs-source-list">
          <span>YOUR SCENE</span>
          <label>
            <input
              type="checkbox"
              checked={alerts}
              onChange={(e) => setAlerts(e.target.checked)}
            />
            HyperChat alerts
          </label>
          <label>
            <input
              type="checkbox"
              checked={audio}
              onChange={(e) => setAudio(e.target.checked)}
            />
            HyperChat audio
          </label>
          <p>Toggle an example source.</p>
        </div>
        <div className="obs-mini-stream">
          <span>YOUR BROADCAST</span>
          <div
            className={alerts ? "mini-overlay" : "mini-overlay hidden-overlay"}
          >
            Ari joined the moment<small>This made my evening.</small>
          </div>
          <AudioLines size={25} style={{ opacity: audio ? 1 : 0.2 }} />
          <span>
            {audio ? "Example audio source on" : "Example audio source off"}
          </span>
        </div>
      </div>
      <p className="tool-note">
        A source preview. This does not connect to OBS.
      </p>
    </div>
  );
}
