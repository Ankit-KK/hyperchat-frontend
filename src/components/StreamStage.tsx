import { AudioLines, MessageCircle, Radio } from "lucide-react";
export default function StreamStage({
  visible = false,
  message,
}: {
  visible?: boolean;
  message: string;
}) {
  return (
    <div className="stream-stage">
      <img
        className="studio-image"
        src="/images/hyperchat-studio.webp"
        srcSet="/images/hyperchat-studio-small.webp 640w, /images/hyperchat-studio.webp 1200w"
        sizes="(max-width: 600px) 80vw, (max-width: 900px) 75vw, 48vw"
        width="1200"
        height="800"
        alt=""
        fetchPriority="high"
      />
      <div className="stream-topline">
        <span>
          <Radio size={12} /> THE OPEN STUDIO
        </span>
        <span>FICTIONAL BROADCAST</span>
      </div>
      <div className="stream-title">
        <span>A SESSION IN GOOD COMPANY</span>
        <strong>
          Stay a little.
          <br />
          <em>Make something.</em>
        </strong>
      </div>
      <div
        className={`stream-alert ${visible ? "visible" : ""}`}
        aria-hidden={!visible}
      >
        <span className="alert-symbol">
          <MessageCircle size={19} />
        </span>
        <div>
          <span className="alert-meta">A FEW WORDS. A SHARED MOMENT.</span>
          <strong>Ari joined the conversation</strong>
          <p>{message}</p>
        </div>
        <span className="alert-signature">hyperchat</span>
      </div>
      <div className="stream-bottomline">
        <span className="studio-avatar">S</span>
        <span>
          Studio session<small>Illustrative creator stream</small>
        </span>
        <AudioLines size={23} />
        <span className="broadcast-time">20:42</span>
      </div>
    </div>
  );
}
