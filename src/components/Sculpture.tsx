import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SceneMode = "connection" | "voice" | "presence";
type Pose = {
  position: [number, number, number];
  rotation: [number, number, number];
};

const MODES: Record<SceneMode, [Pose, Pose]> = {
  connection: [
    { position: [-0.64, 0.18, 0.08], rotation: [0.16, -0.46, -0.28] },
    { position: [0.65, -0.14, 0.03], rotation: [-0.14, 0.62, 0.26] },
  ],
  voice: [
    { position: [-1.18, 0.09, -0.13], rotation: [0.12, -0.36, -0.12] },
    { position: [1.18, -0.09, -0.13], rotation: [-0.12, 0.36, 0.12] },
  ],
  presence: [
    { position: [-0.32, 0.18, -0.28], rotation: [0.35, -0.68, -0.62] },
    { position: [0.42, -0.18, 0.39], rotation: [-0.26, 0.65, 0.62] },
  ],
};

/** A rounded architectural frame, rather than an imported model or a logo. */
function roundedPath(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function frameGeometry() {
  const outline = roundedPath(2.12, 2.95, 0.76);
  const opening = roundedPath(1.22, 2.05, 0.37);
  outline.holes.push(new THREE.Path(opening.getPoints(24).reverse()));
  const geometry = new THREE.ExtrudeGeometry(outline, {
    depth: 0.33,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.105,
    bevelThickness: 0.105,
    curveSegments: 24,
  });
  geometry.translate(0, 0, -0.165);
  // Extrusion duplicates its bevel vertices. Weld them before calculating normals
  // so studio reflections flow continuously around the ceramic and metal edges.
  geometry.deleteAttribute("normal");
  geometry.deleteAttribute("uv");
  const smooth = mergeVertices(geometry, 0.0001);
  geometry.dispose();
  smooth.computeVertexNormals();
  return smooth;
}

function seamGeometry(
  width: number,
  height: number,
  radius: number,
  depth: number,
) {
  const points = roundedPath(width, height, radius)
    .getSpacedPoints(128)
    .map((point) => new THREE.Vector3(point.x, point.y, depth));
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points, true),
    128,
    0.012,
    5,
    true,
  );
}

/** Original, procedurally built communication sculpture. All assets stay local. */
export default function Sculpture() {
  const mount = useRef<HTMLDivElement>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      setUnavailable(true);
      return;
    }

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    let reduced = reducedQuery.matches;
    let disposed = false;
    let contextLost = false;
    let sceneVisible = true;
    let frame = 0;
    let lastDraw = 0;
    let interactionUntil = performance.now() + 250;
    let mode: SceneMode = "connection";
    let viewportWidth = host.clientWidth;
    let viewportHeight = host.clientHeight;
    let baseScale = 1;
    let scrollContext: gsap.Context | undefined;
    const motion = {
      turn: 0,
      tilt: 0,
      roll: 0,
      scale: 1,
      cameraX: 0,
      cameraY: 0,
      cameraZ: 9.4,
      light: 3.6,
    };
    const pointer = new THREE.Vector2();
    const easedPointer = new THREE.Vector2();
    const animated = new Set<gsap.core.Tween>();

    const gl = renderer.getContext();
    const gpuInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const softwareRenderer = gpuInfo
      ? /SwiftShader|llvmpipe|Software/i.test(
          String(gl.getParameter(gpuInfo.UNMASKED_RENDERER_WEBGL)),
        )
      : false;
    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        softwareRenderer ? 1 : window.innerWidth < 700 ? 1.4 : 1.7,
      ),
    );
    renderer.setClearColor(0x221f1c, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.94;
    renderer.shadowMap.enabled = !softwareRenderer;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);
    host.dataset.mode = mode;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0.1, motion.cameraZ);
    const sculpture = new THREE.Group();
    const floatGroup = new THREE.Group();
    sculpture.add(floatGroup);
    scene.add(sculpture);

    // A local neutral studio environment gives metal actual reflections, without an HDR download.
    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(room, 0.025, 0.1, 100, {
      size: softwareRenderer ? 64 : 128,
    });
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.8;
    room.dispose();
    pmrem.dispose();

    const SurfaceMaterial = softwareRenderer
      ? THREE.MeshStandardMaterial
      : THREE.MeshPhysicalMaterial;
    const ceramic = new SurfaceMaterial({
      color: "#F3EDE2",
      metalness: 0.08,
      roughness: 0.25,
      ...(!softwareRenderer
        ? { clearcoat: 0.45, clearcoatRoughness: 0.22 }
        : {}),
    });
    const copper = new SurfaceMaterial({
      color: "#B8702F",
      metalness: 0.88,
      roughness: 0.34,
      ...(!softwareRenderer
        ? { clearcoat: 0.35, clearcoatRoughness: 0.24 }
        : {}),
    });
    const edgeMetal = new THREE.MeshStandardMaterial({
      color: "#D7CBB9",
      metalness: 0.9,
      roughness: 0.25,
    });
    const darkMetal = new THREE.MeshStandardMaterial({
      color: "#221F1C",
      metalness: 0.55,
      roughness: 0.35,
    });
    const innerMetal = new THREE.MeshStandardMaterial({
      color: "#8C847B",
      metalness: 0.88,
      roughness: 0.34,
    });
    const orbitMaterial = new THREE.MeshStandardMaterial({
      color: "#8C847B",
      metalness: 0.7,
      roughness: 0.45,
      transparent: true,
      opacity: 0.42,
    });
    const materials = [
      ceramic,
      copper,
      edgeMetal,
      darkMetal,
      innerMetal,
      orbitMaterial,
    ];
    const geometries = new Set<THREE.BufferGeometry>();
    const remember = <T extends THREE.BufferGeometry>(geometry: T): T => {
      geometries.add(geometry);
      return geometry;
    };
    const frameGeo = remember(frameGeometry());
    const frontSeam = remember(seamGeometry(1.88, 2.71, 0.64, 0.267));
    const rearSeam = remember(seamGeometry(1.88, 2.71, 0.64, -0.267));
    const edgeInset = remember(seamGeometry(1.37, 2.2, 0.43, 0.265));
    const ribGeo = remember(
      new RoundedBoxGeometry(0.027, 0.19, 0.014, 2, 0.006),
    );
    const fastenerGeo = remember(
      new THREE.CylinderGeometry(0.025, 0.025, 0.01, 10),
    );
    const frames: THREE.Group[] = [];

    for (let index = 0; index < 2; index++) {
      const assembly = new THREE.Group();
      const body = new THREE.Mesh(frameGeo, index === 0 ? ceramic : copper);
      body.castShadow = true;
      body.receiveShadow = true;
      assembly.add(body);
      assembly.add(
        new THREE.Mesh(frontSeam, index === 0 ? innerMetal : edgeMetal),
      );
      assembly.add(new THREE.Mesh(rearSeam, darkMetal));
      assembly.add(
        new THREE.Mesh(edgeInset, index === 0 ? innerMetal : darkMetal),
      );
      // The tactile grooves and small fasteners give each loop a manufactured, human scale.
      for (let i = 0; i < 9; i++) {
        const rib = new THREE.Mesh(
          ribGeo,
          index === 0 ? innerMetal : darkMetal,
        );
        rib.position.set((i - 4) * 0.06, -1.245, 0.272);
        assembly.add(rib);
      }
      for (const side of [-1, 1]) {
        const fastener = new THREE.Mesh(
          fastenerGeo,
          index === 0 ? innerMetal : edgeMetal,
        );
        fastener.rotation.x = Math.PI / 2;
        fastener.position.set(side * 0.43, 1.245, 0.27);
        assembly.add(fastener);
      }
      const pose = MODES.connection[index];
      assembly.position.set(...pose.position);
      assembly.rotation.set(...pose.rotation);
      frames.push(assembly);
      floatGroup.add(assembly);
    }

    // Five polished elements form a quiet waveform in the shared space between the frames.
    const voice = new THREE.Group();
    const capsuleGeometry = remember(
      new THREE.CapsuleGeometry(0.043, 0.45, 4, 10),
    );
    const voiceBars: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const bar = new THREE.Mesh(capsuleGeometry, i === 2 ? copper : edgeMetal);
      bar.position.set((i - 2) * 0.145, 0, 0);
      bar.scale.y = [0.42, 0.75, 1.1, 0.75, 0.42][i];
      bar.castShadow = true;
      voiceBars.push(bar);
      voice.add(bar);
    }
    voice.position.set(0.02, 0.02, 0.94);
    voice.rotation.z = -0.08;
    floatGroup.add(voice);

    // A partial, hairline orbit references a broadcast field without adding glow.
    const orbit = new THREE.Group();
    const arcGeometry = remember(
      new THREE.TorusGeometry(2.42, 0.007, 4, 140, Math.PI * 1.65),
    );
    const arc = new THREE.Mesh(arcGeometry, orbitMaterial);
    arc.rotation.z = 0.4;
    orbit.rotation.set(1.15, -0.27, -0.42);
    orbit.add(arc);
    const markerGeometry = remember(new THREE.SphereGeometry(0.035, 12, 8));
    const marker = new THREE.Mesh(markerGeometry, copper);
    marker.position.set(2.42 * Math.cos(0.4), 2.42 * Math.sin(0.4), 0);
    orbit.add(marker);
    const secondMarker = new THREE.Mesh(markerGeometry, ceramic);
    secondMarker.position.set(-1.65, -1.77, 0);
    secondMarker.scale.setScalar(0.7);
    orbit.add(secondMarker);
    floatGroup.add(orbit);

    const ambient = new THREE.HemisphereLight("#F3EDE2", "#221F1C", 1.25);
    const key = new THREE.DirectionalLight("#F3EDE2", 3.6);
    key.position.set(-3.5, 5.5, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -4;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 18;
    key.shadow.normalBias = 0.035;
    key.shadow.bias = -0.0001;
    const rim = new THREE.DirectionalLight("#D7CBB9", 3.2);
    rim.position.set(4, 1, -3);
    const fill = new THREE.DirectionalLight("#F3EDE2", 0.8);
    fill.position.set(1, -3, 4);
    scene.add(ambient, key, rim, fill);

    const render = (time = 0) => {
      if (disposed || contextLost || document.hidden) return;
      easedPointer.lerp(pointer, 0.055);
      sculpture.rotation.set(
        0.12 + motion.tilt + easedPointer.y * 0.06,
        -0.22 + motion.turn + easedPointer.x * 0.1,
        -0.075 + motion.roll,
      );
      sculpture.scale.setScalar(baseScale * motion.scale);
      floatGroup.position.y = reduced ? 0 : Math.sin(time * 0.00065) * 0.048;
      floatGroup.rotation.y = reduced ? 0 : Math.sin(time * 0.0002) * 0.025;
      camera.position.set(motion.cameraX, 0.1 + motion.cameraY, motion.cameraZ);
      camera.lookAt(0, 0, 0);
      key.intensity = motion.light;
      if (mode === "voice" && !reduced) {
        voiceBars.forEach((bar, i) => {
          bar.scale.y =
            0.45 + Math.abs(Math.sin(time * 0.0018 + i * 0.75)) * 0.95;
        });
      }
      renderer.render(scene, camera);
      host.dataset.sceneReady = "true";
    };

    const draw = (time: number) => {
      if (
        disposed ||
        contextLost ||
        document.hidden ||
        !sceneVisible ||
        reduced
      ) {
        frame = 0;
        return;
      }
      const interval = softwareRenderer
        ? 1000 / 8
        : window.innerWidth < 700
          ? 1000 / 40
          : 1000 / 60;
      if (
        time - lastDraw >= interval - 1 &&
        (!softwareRenderer || time < interactionUntil)
      ) {
        render(time);
        lastDraw = time;
      }
      frame = window.requestAnimationFrame(draw);
    };
    const start = () => {
      if (disposed || contextLost || document.hidden || !sceneVisible) return;
      interactionUntil = performance.now() + 300;
      if (reduced) render();
      else if (!frame) frame = window.requestAnimationFrame(draw);
    };
    // The fixed canvas only needs frames while a transparent scene section is visible.
    const exposedSections = new Set<Element>();
    let sectionObserver: IntersectionObserver;
    const observeSections = () => {
      sectionObserver?.disconnect();
      exposedSections.clear();
      const hostBounds = host.getBoundingClientRect();
      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) exposedSections.add(entry.target);
            else exposedSections.delete(entry.target);
          });
          sceneVisible = exposedSections.size > 0;
          if (sceneVisible) start();
          else {
            window.cancelAnimationFrame(frame);
            frame = 0;
          }
        },
        {
          rootMargin: `${-Math.max(0, hostBounds.top)}px 0px ${-Math.max(0, window.innerHeight - hostBounds.bottom)}px 0px`,
        },
      );
      document
        .querySelectorAll(".hero, .interlude")
        .forEach((section) => sectionObserver.observe(section));
    };
    const resize = () => {
      viewportWidth = host.clientWidth;
      viewportHeight = host.clientHeight;
      if (!viewportWidth || !viewportHeight) return;
      renderer.setSize(viewportWidth, viewportHeight, false);
      observeSections();
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
      // Keep the silhouette generously framed on both portrait and landscape screens.
      baseScale = Math.min(1.02, camera.aspect * 1.14);
      render(performance.now());
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    const setupScroll = () => {
      scrollContext?.revert();
      if (reduced) {
        Object.assign(motion, {
          turn: 0,
          tilt: 0,
          roll: 0,
          scale: 1,
          cameraX: 0,
          cameraY: 0,
          cameraZ: 9.4,
          light: 3.6,
        });
        return;
      }
      scrollContext = gsap.context(() => {
        gsap
          .timeline({
            onUpdate: () => {
              interactionUntil = performance.now() + 200;
            },
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.4,
            },
          })
          .to(motion, {
            turn: 1.8,
            tilt: 0.3,
            roll: 0.15,
            scale: 0.9,
            cameraX: 0.5,
            cameraY: -0.2,
            cameraZ: 10.2,
            light: 2.6,
            ease: "none",
            duration: 0.42,
          })
          .to(motion, {
            turn: 3.7,
            tilt: -0.16,
            roll: -0.2,
            scale: 1.08,
            cameraX: -0.4,
            cameraY: 0.4,
            cameraZ: 9.2,
            light: 3.6,
            ease: "none",
            duration: 0.36,
          })
          .to(motion, {
            turn: 4.8,
            tilt: 0.25,
            roll: 0.12,
            scale: 0.88,
            cameraX: 0.5,
            cameraY: 0,
            cameraZ: 10.5,
            light: 2.8,
            ease: "none",
            duration: 0.22,
          });
      }, host);
    };
    setupScroll();

    const tween = (target: object, values: gsap.TweenVars) => {
      gsap.killTweensOf(target);
      if (reduced) {
        gsap.set(target, values);
        return;
      }
      const animation = gsap.to(target, {
        ...values,
        duration: 1.1,
        ease: "power3.inOut",
        onComplete: () => animated.delete(animation),
      });
      animated.add(animation);
    };
    const switchMode = (event: Event) => {
      const requested = (event as CustomEvent<{ mode?: string }>).detail?.mode;
      if (!requested || !(requested in MODES)) return;
      interactionUntil = performance.now() + 1400;
      mode = requested as SceneMode;
      host.dataset.mode = mode;
      frames.forEach((assembly, i) => {
        const pose = MODES[mode][i];
        tween(assembly.position, {
          x: pose.position[0],
          y: pose.position[1],
          z: pose.position[2],
        });
        tween(assembly.rotation, {
          x: pose.rotation[0],
          y: pose.rotation[1],
          z: pose.rotation[2],
        });
      });
      tween(voice.scale, {
        x: mode === "voice" ? 1.4 : 1,
        y: mode === "voice" ? 1.4 : 1,
        z: 1,
      });
      tween(orbit.rotation, {
        x: mode === "presence" ? 0.35 : 1.15,
        y: mode === "voice" ? 0.3 : -0.27,
        z: mode === "presence" ? 0.6 : -0.42,
      });
      if (mode !== "voice")
        voiceBars.forEach((bar, i) =>
          tween(bar.scale, { y: [0.42, 0.75, 1.1, 0.75, 0.42][i] }),
        );
      if (reduced) render();
    };
    const onPointer = (event: PointerEvent) => {
      if (reduced || !pointerQuery.matches) return;
      interactionUntil = performance.now() + 300;
      pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };
    const onPointerLeave = () => {
      interactionUntil = performance.now() + 300;
      pointer.set(0, 0);
    };
    const visibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else start();
    };
    const preference = () => {
      reduced = reducedQuery.matches;
      window.cancelAnimationFrame(frame);
      frame = 0;
      pointer.set(0, 0);
      easedPointer.set(0, 0);
      animated.forEach((animation) => {
        animation.progress(1).kill();
      });
      animated.clear();
      setupScroll();
      start();
    };
    const lost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      window.cancelAnimationFrame(frame);
      frame = 0;
      host.dataset.sceneReady = "false";
      renderer.domElement.style.visibility = "hidden";
      setUnavailable(true);
    };
    const restored = () => {
      contextLost = false;
      renderer.domElement.style.visibility = "visible";
      setUnavailable(false);
      start();
    };
    window.addEventListener("hyperchat:scene-mode", switchMode);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", visibility);
    reducedQuery.addEventListener("change", preference);
    renderer.domElement.addEventListener("webglcontextlost", lost);
    renderer.domElement.addEventListener("webglcontextrestored", restored);
    start();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      scrollContext?.revert();
      animated.forEach((animation) => animation.kill());
      observer.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("hyperchat:scene-mode", switchMode);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      document.removeEventListener("visibilitychange", visibility);
      reducedQuery.removeEventListener("change", preference);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      renderer.domElement.removeEventListener("webglcontextrestored", restored);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      environment.dispose();
      key.shadow.map?.dispose();
      scene.clear();
      renderer.dispose();
      renderer.domElement.remove();
      delete host.dataset.sceneReady;
    };
  }, []);

  return (
    <div
      className={`sculpture ${unavailable ? "sculpture-fallback" : ""}`}
      ref={mount}
      aria-hidden="true"
      data-mode="connection"
    >
      {unavailable && (
        <>
          <i />
          <i />
        </>
      )}
    </div>
  );
}
