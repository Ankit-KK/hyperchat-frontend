import { useEffect, type RefObject } from "react";
import { mascotConfig as config, mascotMessages, type MascotState } from "../components/mascotConfig";
import { createMascotPlayback } from "../components/mascotPlayback";

const editable = "input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox']";
const clickable = "a[href], button, [role='button'], [role='tab'], summary, label[for]";
let introducedInMemory = false;

function introductionSeen() {
  try {
    return introducedInMemory || sessionStorage.getItem(config.sessionKey) === "shown";
  } catch {
    return introducedInMemory;
  }
}

function mountCursor(root: HTMLDivElement) {
  const character = root.querySelector<HTMLElement>(".mascot-character")!;
  const hotspot = root.querySelector<HTMLElement>(".mascot-hotspot")!;
  const bubble = root.querySelector<HTMLElement>(".mascot-bubble")!;
  const videos = Array.from(root.querySelectorAll("video"));
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  let disposed = false;
  let inside = false;
  let keyboard = false;
  let dragging = false;
  let available = true;
  let visible = false;
  let blocked = false;
  let hovered: Element | null = null;
  let moved = false;
  let motion: MascotState = "idle";
  let desired: MascotState = "idle";
  let excitedUntil = 0;
  let nextMessageAt = introductionSeen() ? Date.now() + config.messageCooldown : 0;
  let lastMessage = "";
  let messageIndex = 0;
  let bubbleHeight = 64;
  let frame = 0;
  let lastFrame = 0;
  const pointer = { x: 0, y: 0 };
  const position = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  const cancel = (name: string) => {
    clearTimeout(timers.get(name));
    timers.delete(name);
  };
  const later = (name: string, callback: () => void, delay: number) => {
    cancel(name);
    timers.set(name, setTimeout(() => {
      timers.delete(name);
      if (!disposed) callback();
    }, delay));
  };
  const clamp = (value: number, maximum: number) => Math.max(8, Math.min(value, maximum - 8));
  const placeTarget = () => {
    // Clamp continuously instead of flipping sides at an edge, which would
    // make a one-pixel pointer movement send the character across the pointer.
    target.x = clamp(pointer.x + 14, innerWidth - config.width);
    target.y = clamp(pointer.y + 10, innerHeight - config.height);
    hotspot.style.transform = `translate3d(${pointer.x - 3}px, ${pointer.y - 3}px, 0)`;
  };
  const paint = () => {
    character.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    const x = clamp(position.x + config.width + config.bubbleWidth < innerWidth
      ? position.x + config.width - 8 : position.x - config.bubbleWidth + 8, innerWidth - config.bubbleWidth);
    const y = clamp(position.y - bubbleHeight - 18 > 8
      ? position.y - bubbleHeight - 18 : position.y + config.height + 12, innerHeight - bubbleHeight);
    bubble.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const tick = (time: number) => {
    frame = 0;
    if (!inside || disposed) return;
    const factor = 1 - Math.exp(-Math.min(lastFrame ? time - lastFrame : 16, 50) / 65);
    lastFrame = time;
    position.x += (target.x - position.x) * factor;
    position.y += (target.y - position.y) * factor;
    paint();
    if (Math.hypot(target.x - position.x, target.y - position.y) > 0.2) frame = requestAnimationFrame(tick);
    else lastFrame = 0;
  };
  const animate = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };
  const dismissSpeech = () => {
    bubble.dataset.open = "false";
    cancel("speech-hide");
    cancel("introduction");
    cancel("hover-speech");
  };
  const allowed = () => inside && available && !keyboard && !dragging && !blocked && !document.hidden;
  const say = (message: string, introduction = false) => {
    if (!visible || !allowed() || Date.now() < nextMessageAt || lastMessage === message) return;
    bubble.textContent = message;
    bubbleHeight = bubble.offsetHeight;
    paint();
    bubble.dataset.open = "true";
    lastMessage = message;
    nextMessageAt = Date.now() + config.messageCooldown;
    if (introduction) {
      introducedInMemory = true;
      try { sessionStorage.setItem(config.sessionKey, "shown"); } catch { /* Page-local fallback. */ }
    }
    later("speech-hide", () => { bubble.dataset.open = "false"; }, config.messageDuration);
  };
  const speak = (kind: "movement" | "hover") => {
    if (!introductionSeen() || Date.now() < nextMessageAt) return;
    const choices = mascotMessages[kind];
    const message = choices[messageIndex++ % choices.length];
    say(message === lastMessage ? choices[messageIndex++ % choices.length] : message);
  };
  const hide = () => {
    visible = false;
    root.dataset.active = "false";
    document.documentElement.classList.remove("has-mascot-cursor");
    dismissSpeech();
    cancelAnimationFrame(frame);
    frame = lastFrame = 0;
    playback.pause();
  };
  const playback = createMascotPlayback(videos, (state) => {
    if (!allowed()) { playback.pause(); return; }
    root.dataset.state = state;
    root.dataset.active = "true";
    document.documentElement.classList.add("has-mascot-cursor");
    visible = true;
    paint();
    if (!introductionSeen() && !timers.has("introduction")) {
      later("introduction", () => say(mascotMessages.introduction, true), config.introductionDelay);
    }
  }, () => {
    available = false;
    hide();
  });

  const chooseState = (immediate = false) => {
    const state: MascotState = Date.now() < excitedUntil ? "excited" : hovered ? "curious" : motion;
    if (state === desired) return;
    desired = state;
    later("state", () => { if (allowed()) playback.request(desired); }, immediate ? 0 : config.stateDwell);
  };
  const context = () => {
    const element = document.elementFromPoint(pointer.x, pointer.y);
    blocked = !!document.activeElement?.matches(editable) || !!element?.closest(editable)
      || !!document.querySelector("dialog[open], [aria-modal='true']");
    const candidate = element?.closest(clickable) ?? null;
    const next = candidate?.matches(":disabled, [aria-disabled='true']") ? null : candidate;
    if (hovered !== next) {
      hovered = next;
      cancel("hover-speech");
    }
    if (hovered && !blocked && introductionSeen() && Date.now() >= nextMessageAt && !timers.has("hover-speech")) {
      later("hover-speech", () => speak("hover"), config.hoverDwell);
    }
    chooseState();
    if (!allowed()) hide();
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") { inside = false; hide(); return; }
    const first = !inside || !visible;
    const dy = event.clientY - pointer.y;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    inside = true;
    keyboard = false;
    if (event.buttons === 0) dragging = false;
    moved = !first;
    placeTarget();
    if (first) { position.x = target.x; position.y = target.y; paint(); }
    motion = moved ? dy < -3 ? "lookingUp" : "curious" : "idle";
    context();
    if (!allowed()) return;
    if (!visible) playback.resume(desired);
    animate();
    later("motion-idle", () => {
      motion = "idle";
      chooseState();
      if (!hovered && moved) speak("movement");
    }, config.movementIdle);
  };
  const over = () => { if (inside) context(); };
  const down = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || !inside) return;
    dismissSpeech();
    context();
    if (hovered && !blocked) {
      excitedUntil = Date.now() + config.excitementDuration;
      chooseState(true);
      later("excitement", () => chooseState(), config.excitementDuration);
    } else {
      dragging = true;
      hide();
    }
  };
  const up = () => {
    dragging = false;
    context();
    if (allowed()) playback.resume(desired);
  };
  const leave = () => { inside = false; dragging = false; hide(); };
  const out = (event: PointerEvent) => { if (!event.relatedTarget) leave(); };
  const key = () => { keyboard = true; hide(); };
  const focus = () => { if (inside) context(); };
  const scroll = () => { if (inside) { dismissSpeech(); context(); } };
  const resize = () => {
    if (!inside) return;
    pointer.x = Math.min(pointer.x, innerWidth - 1);
    pointer.y = Math.min(pointer.y, innerHeight - 1);
    placeTarget();
    position.x = clamp(position.x, innerWidth - config.width);
    position.y = clamp(position.y, innerHeight - config.height);
    paint();
    context();
    if (allowed()) animate();
  };

  root.dataset.enabled = "true";
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("pointerover", over, { passive: true });
  window.addEventListener("pointerout", out, { passive: true });
  window.addEventListener("pointerdown", down, { passive: true });
  window.addEventListener("pointerup", up, { passive: true });
  window.addEventListener("pointercancel", leave);
  window.addEventListener("blur", leave);
  window.addEventListener("pagehide", leave);
  window.addEventListener("keydown", key);
  window.addEventListener("focusin", focus);
  window.addEventListener("scroll", scroll, { passive: true, capture: true });
  window.addEventListener("resize", resize);
  window.addEventListener("hashchange", scroll);
  window.addEventListener("popstate", leave);
  document.addEventListener("visibilitychange", leave);

  return () => {
    disposed = true;
    leave();
    timers.forEach(clearTimeout);
    timers.clear();
    playback.destroy();
    root.dataset.enabled = "false";
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerover", over);
    window.removeEventListener("pointerout", out);
    window.removeEventListener("pointerdown", down);
    window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", leave);
    window.removeEventListener("blur", leave);
    window.removeEventListener("pagehide", leave);
    window.removeEventListener("keydown", key);
    window.removeEventListener("focusin", focus);
    window.removeEventListener("scroll", scroll, true);
    window.removeEventListener("resize", resize);
    window.removeEventListener("hashchange", scroll);
    window.removeEventListener("popstate", leave);
    document.removeEventListener("visibilitychange", leave);
  };
}

export function useMascotCursor(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const media = matchMedia(config.media);
    let stop: (() => void) | undefined;
    const sync = () => {
      stop?.();
      stop = undefined;
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (media.matches && !connection?.saveData && root.current) stop = mountCursor(root.current);
    };
    sync();
    media.addEventListener("change", sync);
    return () => { media.removeEventListener("change", sync); stop?.(); };
  }, [root]);
}
