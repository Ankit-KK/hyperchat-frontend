import { useEffect, useRef, useState } from "react";
import { ArrowDown, Check, Monitor, RotateCcw, Send, X } from "lucide-react";
import "./ConnectedModeration.css";

const channels = ["Dashboard", "Telegram", "Discord"] as const;
type Channel = typeof channels[number];
type Status = "pending" | "approved" | "delivered" | "rejected";

export default function ConnectedModeration() {
  const [status, setStatus] = useState<Status>("pending");
  const [source, setSource] = useState<Channel | null>(null);
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearDelivery = () => { if (timer.current !== null) clearTimeout(timer.current); timer.current = null; };
  useEffect(() => () => clearDelivery(), []);

  const decide = (channel: Channel, approve: boolean) => {
    if (locked.current) return;
    locked.current = true;
    setSource(channel);
    setStatus(approve ? "approved" : "rejected");
    if (approve) timer.current = setTimeout(() => { setStatus("delivered"); timer.current = null; }, 1100);
  };
  const reset = () => { clearDelivery(); locked.current = false; setSource(null); setStatus("pending"); };
  const label = status === "pending" ? "Awaiting review" : status === "rejected" ? "Rejected" : "Approved";
  const announcement = status === "pending" ? "Sample interaction awaiting review. Choose any channel."
    : status === "approved" ? `Approved from ${source}. All three views updated. Sending to the local stream preview.`
    : status === "delivered" ? `Approved from ${source}. Delivered once to the local stream preview.`
    : `Rejected from ${source}. All three views updated. Nothing sent to the stream preview.`;

  return <section id="connected-moderation" className="connected-moderation section-shell" aria-labelledby="connected-moderation-title" data-state={status}>
    <div className="section-label"><span>MODERATION, WHERE YOU ARE</span><span>THREE VIEWS. ONE QUEUE.</span></div>
    <div className="moderation-heading">
      <h2 id="connected-moderation-title">One decision.<br/><em>Everywhere in sync.</em></h2>
      <p>Review an interaction from your dashboard, Telegram, or Discord. Try a decision below: every view follows the same queue, and an approved message reaches the stream preview once.</p>
    </div>
    <div className="moderation-demo-toolbar"><span>INTERACTIVE CONCEPT · SAMPLE #HC-1042</span><button onClick={reset} type="button"><RotateCcw size={14} aria-hidden="true"/> Reset demo</button></div>
    <div className="moderation-channels">
      {channels.map((channel, index) => <article className="moderation-channel" key={channel} aria-labelledby={`channel-${index}`}>
        <div className="moderation-channel-title"><span aria-hidden="true">0{index + 1}</span><h3 id={`channel-${index}`}>{channel}</h3></div>
        <div className="moderation-channel-meta"><span>{channel === "Dashboard" ? "Review queue" : "HyperChat · bot preview"}</span><span className="moderation-state">{label}</span></div>
        <p className="moderation-viewer">Ari <span>EXAMPLE VIEWER</span></p>
        <blockquote>“That was an incredible play. Keep it going!”</blockquote>
        <p className="moderation-shared-id">TEXT INTERACTION · #HC-1042</p>
        <div className="moderation-decisions">
          <button type="button" disabled={status !== "pending"} onClick={() => decide(channel, true)} aria-label={`Approve from ${channel}`}><Check size={15} aria-hidden="true"/>Approve</button>
          <button type="button" disabled={status !== "pending"} onClick={() => decide(channel, false)} aria-label={`Reject from ${channel}`}><X size={15} aria-hidden="true"/>Reject</button>
        </div>
        <p className="moderation-sync">{source ? `${label} from ${source} · synced here` : "Choose here or in either other view."}</p>
      </article>)}
    </div>
    <div className="moderation-delivery" aria-hidden="true"><span/><div>{status === "approved" ? <Send size={18}/> : <ArrowDown size={18}/>}</div><span/></div>
    <div className="moderation-stream">
      <div className="moderation-stream-label"><Monitor size={20} aria-hidden="true"/><span>YOUR STREAM<br/><small>LOCAL OBS PREVIEW</small></span></div>
      <div className="moderation-stream-message" key={status}>
        {status === "delivered" ? <><span>Ari · Text interaction</span><p>That was an incredible play. Keep it going!</p></> : <p>{status === "rejected" ? "Kept off stream. Your decision, everywhere." : status === "approved" ? "Approved. Bringing the message to your stream…" : "The spotlight waits for your approval."}</p>}
      </div>
      <span className="moderation-delivery-count">{status === "delivered" ? "01" : "00"}<small>DELIVERED</small></span>
    </div>
    <p className="moderation-announcement" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    <p className="moderation-disclaimer">Illustrative local demo. Telegram, Discord, and OBS are not connected here. No messages, approvals, or account data leave this preview. <a href="/support#moderation-help">About moderation ↗</a></p>
  </section>;
}
