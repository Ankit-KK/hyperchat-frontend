import { AudioLines, Heart, Radio } from "lucide-react";
import { formatAmount } from "../data/demo";
export default function StreamStage({
  visible = false,
  amount = 250,
}: {
  visible?: boolean;
  amount?: number;
}) {
  return (
    <div className="stream-stage">
      <div className="stream-topline">
        <span>
          <Radio size={12} /> THE OPEN STUDIO
        </span>
        <span>FICTIONAL BROADCAST</span>
      </div>
      <div className="studio-art" aria-hidden="true">
        <div className="studio-window" />
        <div className="studio-panel" />
        <div className="studio-desk" />
        <div className="studio-mic">
          <i />
          <span />
        </div>
        <div className="studio-speaker">
          <i />
          <i />
        </div>
        <div className="studio-notebook" />
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
          <Heart size={19} />
        </span>
        <div>
          <span className="alert-meta">A LITTLE SUPPORT, A BIG MOMENT</span>
          <strong>Ari sent {formatAmount(amount)}</strong>
          <p>This made my evening. Keep creating!</p>
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
