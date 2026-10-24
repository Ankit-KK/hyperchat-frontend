import { useEffect, useRef, useState } from "react";
import { ImagePlus, Play, RotateCcw } from "lucide-react";

export default function MediaPreview() {
  const [kind, setKind] = useState<"Image" | "GIF">("Image");
  const [media, setMedia] = useState<{url:string;name:string} | null>(null);
  const [show, setShow] = useState(false);
  const [notice, setNotice] = useState("Choose an image to try the local preview.");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => () => { if(media) URL.revokeObjectURL(media.url); }, [media]);
  const reset = () => { setShow(false); setMedia(null); if(input.current) input.current.value=""; };
  return <div className="tool-preview media-tool">
    <div className="tool-heading"><h3>Media on your stream</h3><span>LOCAL PREVIEW</span></div>
    <div className="segmented-control" role="group" aria-label="Media type">{(["Image","GIF"] as const).map(type=><button key={type} aria-pressed={kind===type} onClick={()=>{reset();setKind(type);setNotice(`Choose ${type === "GIF" ? "a GIF" : "an image"} to try the local preview.`);}}>{type}</button>)}</div>
    <div className="media-broadcast" aria-label="Example broadcast area">
      <span className="overlay-guide">YOUR BROADCAST AREA</span>
      {media && show ? <figure className="media-alert"><img src={media.url} alt={`Local ${kind.toLowerCase()} preview: ${media.name}`} onError={()=>{reset();setNotice("This file could not be displayed. Please choose another image.");}}/><figcaption>Ari · example viewer<br/><strong>A little moment, shared.</strong></figcaption></figure> : <div className="media-placeholder"><ImagePlus size={30} aria-hidden="true"/><p>{media ? "Ready when you are." : `Your ${kind === "GIF" ? "GIF" : "image"} appears here.`}</p><small>{kind === "GIF" ? "Animation starts only when you press Show preview." : "Try an image from your device."}</small></div>}
    </div>
    <label className="media-file-label" htmlFor="media-preview-file">Choose {kind === "GIF" ? "a GIF" : "an image"} · up to 5 MB</label>
    <input ref={input} id="media-preview-file" type="file" accept={kind === "GIF" ? "image/gif" : "image/png,image/jpeg,image/webp"} onChange={event=>{
      const file=event.target.files?.[0]; if(!file)return;
      const allowed=kind === "GIF" ? ["image/gif"] : ["image/png","image/jpeg","image/webp"];
      if(!allowed.includes(file.type) || file.size>5*1024*1024){reset();setNotice(`Choose ${kind === "GIF" ? "a GIF" : "a PNG, JPG, or WebP image"} smaller than 5 MB.`);return;}
      setMedia({url:URL.createObjectURL(file),name:file.name});setShow(false);setNotice(`${file.name} selected. Press Show preview when ready.`);
    }}/>
    <div className="media-actions"><button className="icon-text-button" disabled={!media} onClick={()=>{setShow(value=>!value);setNotice(show ? "Preview hidden." : "Showing your media locally. Nothing has been submitted.");}}><Play size={12} aria-hidden="true"/>{show ? "Hide preview" : "Show preview"}</button><button className="icon-text-button" disabled={!media} onClick={()=>{reset();setNotice("Preview cleared. Choose another file to try again.");}}><RotateCcw size={12} aria-hidden="true"/>Clear media</button></div>
    <p className="tool-note" role="status">{notice}</p>
    <p className="tool-note">Your file stays in this browser tab. Nothing is uploaded or sent to a stream. GIFs may contain motion; show or hide them whenever you choose.</p>
  </div>;
}
