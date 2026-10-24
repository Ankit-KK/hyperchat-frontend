import { useEffect, useRef, useState } from "react";
import { Box, Plate, path, curve, Flight, Press, type Vec3, type Box3 } from "react-isokit";



// Sequential adaptation of the supplied WebhookRelay illustration.
const devices: (Box3 & { label: string; caption: string })[] = [
  { x: 10, y: 18, z: 8, w: 52, d: 38, h: 26, label: "VIEWER", caption: "Your interaction" },
  { x: 90, y: 18, z: 8, w: 52, d: 38, h: 34, label: "HYPERCHAT", caption: "Creator review" },
  { x: 170, y: 18, z: 8, w: 52, d: 38, h: 26, label: "OBS", caption: "Browser source" },
  { x: 250, y: 18, z: 8, w: 52, d: 38, h: 34, label: "LIVE", caption: "Shared moment" },
];
const cables = devices.slice(0,-1).map((device,i) => {
  const next = devices[i+1];
  return path(curve([device.x+52,37,10], [device.x+65,37,10], [next.x-10,37,10], [next.x,37,10],24));
});
const messages = ["Ready for a sample interaction.", "A viewer sends a sample message.", "HyperChat processes the sample interaction.", "The sample alert arrives in OBS.", "A shared moment. Demo complete."];
const SEND = { x: 10, y: 66, z: 8, w: 52, d: 22, h: 6 };
const HOP = 760;
const parcelAt = (i: number): Vec3 => [devices[i].x + 18, devices[i].y + 10, devices[i].z + devices[i].h + 3];
export default function InteractionFlow() {
  const [step,setStep] = useState(0);
  const [run,setRun] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clear(), []);
  const send = () => {
    clear(); setRun(value=>value+1); setStep(1);
    for(let i=1;i<=3;i++) timers.current.push(setTimeout(()=>setStep(i+1),i*HOP));
  };
  const reset = () => { clear(); setStep(0); };
  return <div className="interaction-flow" aria-label="Viewer to live stream demo">
    <div className="integration-demo">
      <Plate className="hyperchat-relay sequential-relay" theme="light" fig="HYPERCHAT / OBS" name="The interaction journey" hint="A local, interactive example" readout={step === 0 ? "Ready" : step === 1 ? "Message in flight" : step < 4 ? "Playing the example" : "Complete"} fit={[{x:0,y:0,z:0,w:314,d:74,h:8}, SEND, ...devices]} aspect={2.5} label="Four connected devices: Viewer, HyperChat creator review, OBS browser source, and live audience.">
        <Box x={0} y={0} z={0} w={314} d={74} h={8} r={7}/>
        {cables.map((d,i)=><path key={i} d={d} className={`relay-cable ${step >= i+2 ? "is-delivered" : ""}`} />)}
        {devices.map((device,i) => { const active = step > i; return <g key={device.label} data-active={active} className="relay-device">
          <Box {...device} r={4} top={<><text x={5} y={29} className="ik-label relay-label">{device.label}</text><circle cx={44} cy={8} r={2} className="relay-lamp"/></>} front={<><rect x={5} y={5} width={42} height={14} rx={2} className="ik-screen"/><text x={9} y={14} className="ik-screen-text" fontSize={5}>{active ? "READY" : "WAITING"}</text></>}/>
        </g>; })}
        <Press label="Send sample interaction" sound={false} onPress={send}>
          <Box {...SEND} r={5} top={<><text x={7} y={14} className="ik-label flow-send-label">SEND</text><path d="M36 10l9-4-3 10-3-4-3-2 9-4" className="ik-line"/></>} />
        </Press>
        {step > 0 && <g key={run} className="flow-envelopes">{devices.slice(0,-1).map((_,i)=>{
          const from = parcelAt(i); const to = parcelAt(i+1);
          return <g key={i} className="flow-envelope-hop" style={{animationDelay:`${i*HOP}ms`,animationDuration:`${HOP}ms`}}>
            <Flight from={from} to={to} delay={i*HOP} duration={HOP} lift={28}>
              <Box x={from[0]} y={from[1]} z={from[2]} w={16} d={11} h={2.5} r={1.2} top={<path className="ik-detail" d="M1.6 1.6L8 6.6L14.4 1.6"/>}/>
            </Flight>
          </g>;
        })}</g>}
      </Plate>
      <div className="integration-controls"><p role="status" aria-label="Journey status" aria-live="polite">{messages[step]}</p><div>
        <button className="button dark" onClick={send}>{step > 0 ? "Replay journey ↗" : "Send sample interaction ↗"}</button>
        {step > 0 && <button className="relay-reset" onClick={reset}>Reset demo ↻</button>}
      </div></div>
    </div>
  </div>;
}
