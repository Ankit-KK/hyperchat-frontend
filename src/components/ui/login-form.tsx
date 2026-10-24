import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import "./login-form.css";
const vertexSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;
const fragmentSource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution;
    vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

    float time = iTime * 0.5;

    // Normalize mouse input (0.0 - 1.0) and remap to -1.0 ~ 1.0
    vec2 mouse = iMouse / iResolution;
    vec2 rippleCenter = 2.0 * mouse - 1.0;

    vec2 distortion = centeredUV;
    // Apply distortion for a wavy, smokey effect
    for (float i = 1.0; i < 8.0; i++) {
        distortion.x += 0.5 / i * cos(i * 2.0 * distortion.y + time + rippleCenter.x * 3.1415);
        distortion.y += 0.5 / i * cos(i * 2.0 * distortion.x + time + rippleCenter.y * 3.1415);
    }

    // Create a glowing wave pattern
    float wave = abs(sin(distortion.x + distortion.y + time));
    float glow = 1.0 - smoothstep(0.2, 0.9, wave);

    fragColor = vec4(mix(vec3(0.133, 0.122, 0.110), u_color, glow * 0.22), 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

// Adapted from the supplied SmokeyBackground: one context, bounded resolution,
// no React updates on pointer movement, and complete playback/resource cleanup.
export function SmokeyBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const program = gl.createProgram();
    if (!program) return;
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]] as const) {
      const shader = gl.createShader(type);
      if (!shader) continue;
      shaders.push(shader); gl.shaderSource(shader, source); gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach(s => gl.deleteShader(s)); gl.deleteProgram(program); return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "iResolution");
    const time = gl.getUniformLocation(program, "iTime");
    const mouse = gl.getUniformLocation(program, "iMouse");
    gl.uniform3f(gl.getUniformLocation(program, "u_color"), 0.72, 0.44, 0.18);
    let x = 0.5, y = 0.5, frame = 0, visible = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const draw = (now: number) => {
      const w = Math.max(1, Math.round(canvas.clientWidth * 0.65));
      const h = Math.max(1, Math.round(canvas.clientHeight * 0.65));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0,0,w,h); gl.uniform2f(resolution,w,h);
      gl.uniform1f(time,reduced.matches ? 0 : now / 1000);
      gl.uniform2f(mouse,x*w,y*h); gl.drawArrays(gl.TRIANGLES,0,6);
      frame = visible && !document.hidden && !reduced.matches ? requestAnimationFrame(draw) : 0;
    };
    const resume = () => { cancelAnimationFrame(frame); frame = 0; if (visible && !document.hidden) draw(performance.now()); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
    observer.observe(canvas);
    const resize = new ResizeObserver(resume); resize.observe(canvas);
    const move = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); x = (event.clientX-rect.left)/rect.width; y = 1-(event.clientY-rect.top)/rect.height; };
    const parent = canvas.parentElement;
    parent?.addEventListener("pointermove", move);
    document.addEventListener("visibilitychange", resume); reduced.addEventListener("change",resume);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); parent?.removeEventListener("pointermove",move); document.removeEventListener("visibilitychange",resume); reduced.removeEventListener("change",resume); gl.deleteBuffer(buffer); shaders.forEach(s=>gl.deleteShader(s)); gl.deleteProgram(program); };
  }, []);
  return <canvas ref={ref} className="signup-smoke" aria-hidden="true" />;
}

export function SignupForm() {
  const [complete, setComplete] = useState(false);
  return <section className="signup-demo" aria-labelledby="signup-title">
    <SmokeyBackground />
    <div className="signup-card">
      <span className="eyebrow">HYPERCHAT / SIGNUP PREVIEW</span>
      <h1 id="signup-title">Your next chapter,<br/>with your community.</h1>
      <p>A little interaction. A shared moment. Start here.</p>
      <p className="signup-notice">Demo only. No account is created and nothing is sent or saved. Use sample details.</p>
      {complete ? <div role="status" className="signup-success"><h2>You’re ready for the next step.</h2><p>That’s the signup preview. Your details have been cleared.</p><button className="button dark" onClick={()=>setComplete(false)}>Try again</button></div> :
      <form onSubmit={event => { event.preventDefault(); event.currentTarget.reset(); setComplete(true); }}>
        <div className="signup-field"><input id="demo-name" name="name" placeholder=" " required maxLength={80} autoComplete="off" /><label htmlFor="demo-name">Creator name</label></div>
        <div className="signup-field"><input id="demo-email" name="email" type="email" placeholder=" " required autoComplete="off" /><label htmlFor="demo-email">Email address</label></div>
        <label className="signup-check"><input type="checkbox" required />I understand this is a demo, not account registration.</label>
        <button type="submit" className="button dark">Try signup <ArrowRight size={17} aria-hidden="true" /></button>
      </form>}
      <a className="signup-return" href="/creators">Explore HyperChat for creators ↗</a>
    </div>
  </section>;
}
