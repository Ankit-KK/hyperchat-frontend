import { useEffect, useRef, useState } from "react";
import { Box, Plate, path, curve, type Box3 } from "react-isokit";



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
const messages = ["Ready for a sample interaction.", "Sample message sent. Waiting for creator review.", "Approved in this demo. The alert is ready for OBS.", "The sample alert is playing in OBS.", "A shared moment. Demo complete."];
export default function InteractionFlow() {
  const [step,setStep] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  useEffect(() => () => clear(), []);
  const send = () => { clear(); setStep(1); };
  const approve = () => {
    clear(); setStep(2);
    timer.current = setTimeout(() => { setStep(3); timer.current = setTimeout(() => { setStep(4); timer.current = null; },900); },900);
  };
  return <div className="interaction-flow" aria-label="Viewer to live stream demo">
    <div className="integration-demo">
      <Plate className="hyperchat-relay sequential-relay" theme="light" fig="HYPERCHAT / OBS" name="The interaction journey" hint="A local, interactive example" readout={step === 0 ? "Ready" : step === 1 ? "Awaiting review" : step < 4 ? "Playing the example" : "Complete"} fit={[{x:0,y:0,z:0,w:314,d:74,h:8}, ...devices]} aspect={2.5} label="Four connected devices: Viewer, HyperChat creator review, OBS browser source, and live audience.">
        <Box x={0} y={0} z={0} w={314} d={74} h={8} r={7}/>
        {cables.map((d,i)=><path key={i} d={d} className={`relay-cable ${step >= i+2 ? "is-delivered" : ""}`} />)}
        {devices.map((device,i) => { const active = step > i; return <g key={device.label} data-active={active} className="relay-device">
          <Box {...device} r={4} top={<><text x={5} y={29} className="ik-label relay-label">{device.label}</text><circle cx={44} cy={8} r={2} className="relay-lamp"/></>} front={<><rect x={5} y={5} width={42} height={14} rx={2} className="ik-screen"/><text x={9} y={14} className="ik-screen-text" fontSize={5}>{i === 1 && step === 1 ? "REVIEW" : active ? "READY" : "WAITING"}</text></>}/>
        </g>; })}
      </Plate>
      <div className="integration-controls"><p role="status" aria-label="Journey status" aria-live="polite">{messages[step]}</p><div>
        {step === 0 && <button className="button dark" onClick={send}>Send sample interaction ↗</button>}
        {step === 1 && <><button className="button dark" onClick={approve}>Approve sample →</button><button className="relay-reset" onClick={()=>{clear();setStep(0);}}>Hide sample</button></>}
        {step >= 2 && <button className="relay-reset" onClick={()=>{clear();setStep(0);}}>Reset demo ↻</button>}
      </div></div>
    </div>
  </div>;
}
