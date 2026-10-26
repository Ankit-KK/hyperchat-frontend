"use client";

import { useState } from "react";
import { ArrowUpRight, House, Mic, Power, Radio, Video } from "lucide-react";
import "./phosphor-crt-404.css";

const channels = [
  { name: "STREAM NOT FOUND", note: "This channel has gone off air.", icon: Video },
  { name: "SIGNAL LOST", note: "Let’s get you back to the live moments.", icon: Radio },
  { name: "MIC CHECK. ANYONE HERE?", note: "No stream at this address. Your next moment is home.", icon: Mic },
];

export default function PhosphorCrt404() {
  const [powered, setPowered] = useState(true);
  const [channel, setChannel] = useState(0);
  const current = channels[channel];
  const Icon = current.icon;
  return <section className="crt404 section-shell" aria-labelledby="crt404-title">
    <div className="crt404-heading"><span className="eyebrow">HYPERCHAT / OFF AIR</span><h1 id="crt404-title">A little off channel.</h1><p>The page you’re looking for isn’t here. Let’s find your way back.</p></div>
    <div className="crt404-set" data-powered={powered}>
      <div className="crt404-antenna" aria-hidden="true"><span/><span/></div>
      <div className="crt404-cabinet">
        <div className="crt404-screen">
          <span className="crt404-screen-content" aria-hidden="true">
            <span className="crt404-screen-top"><span>HC — CH. 0{channel + 1}</span><span><i/> NO SIGNAL</span></span>
            <span className="crt404-test-pattern"><span/><span/><span/><span/><span/></span>
            <span className="crt404-error">404</span>
            <span className="crt404-channel"><Icon size={18}/>{current.name}</span>
            <span className="crt404-scope"><span/><span/><span/><span/><span/><span/><span/></span>
            <span className="crt404-screen-bottom">BROADCAST ENDED · RETURN TO HOME</span>
          </span>
          {!powered && <span className="crt404-off" aria-hidden="true">POWER OFF</span>}
          <button type="button" className="crt404-tuner" onClick={() => setChannel(value => (value + 1) % channels.length)} disabled={!powered} aria-label="Change broadcast channel" aria-describedby="crt404-channel-hint" />
        </div>
        <div className="crt404-controls">
          <span className="crt404-brand" aria-hidden="true">HC<span>BROADCAST RECEIVER</span></span>
          <button className="crt404-power" type="button" onClick={() => setPowered(value => !value)} aria-label={powered ? "Turn screen off" : "Turn screen on"} aria-pressed={powered}><Power size={23} aria-hidden="true"/></button>
          <span className="crt404-power-label" aria-hidden="true">POWER</span>
          <div className="crt404-speaker" aria-hidden="true">{Array.from({length:9},(_,i)=><span key={i}/>)}</div>
        </div>
      </div>
      <div className="crt404-feet" aria-hidden="true"><span/><span/></div>
    </div>
    <p className="crt404-status" role="status" aria-live="polite">{powered ? current.note : "Screen off. Home is still one click away."}</p>
    <p id="crt404-channel-hint" className="crt404-hint">Click the screen to change channels. Try the power button.</p>
    <div className="crt404-actions"><a className="crt404-home" href="/"><House size={17} aria-hidden="true"/>Back to home<ArrowUpRight size={16} aria-hidden="true"/></a><a href="/support">Need a hand?</a></div>
  </section>;
}
