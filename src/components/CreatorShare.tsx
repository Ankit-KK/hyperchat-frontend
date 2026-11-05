import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export function creatorShareUrl(id: string) {
  const url = new URL('/creators', window.location.origin);
  url.searchParams.set('creator', id);
  url.hash = 'creator-showcase';
  return url.href;
}

export default function CreatorShare({ id, name }: { id: string; name: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'manual'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const request = useRef(0);
  useEffect(() => {
    setStatus('idle');
    return () => { clearTimeout(timer.current); request.current++; };
  }, [id]);
  const copy = async () => {
    const current = ++request.current;
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(creatorShareUrl(id));
      if (current !== request.current) return;
      setStatus('copied');
      timer.current = setTimeout(() => setStatus('idle'), 3000);
    } catch {
      if (current === request.current) setStatus('manual');
    }
  };
  return <div className="creator-share">
    <button type="button" onClick={copy} aria-label={`Copy link to ${name}`}>
      {status === 'copied' ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      {status === 'copied' ? 'Copied!' : 'Copy link'}
    </button>
    <span className="sr-only" role="status">{status === 'copied' ? `Link to ${name} copied.` : status === 'manual' ? 'Copy unavailable. Select and copy the link below.' : ''}</span>
    {status === 'manual' && <label className="creator-share-fallback">Select and copy this link
      <input aria-label={`Share link for ${name}`} readOnly value={creatorShareUrl(id)} onFocus={event => event.target.select()} />
    </label>}
  </div>;
}
