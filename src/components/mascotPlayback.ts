import { mascotVideos, type MascotState } from "./mascotConfig";

/** Two bounded players: the current frame remains visible until the next clip
 * really decodes. The handoff is atomic, never a two-character crossfade. */
export function createMascotPlayback(
  videos: HTMLVideoElement[],
  onReady: (state: MascotState) => void,
  onUnavailable: () => void,
) {
  let active = -1;
  let desired: MascotState = "idle";
  let pending = -1;
  let generation = 0;
  let disposed = false;
  let suspended = false;
  let deadline: ReturnType<typeof setTimeout> | undefined;
  let frame: number | undefined;
  const states: (MascotState | undefined)[] = [];
  const failed = new Set<MascotState>();
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const context = probe.getContext("2d", { willReadFrequently: true });

  const cancelPending = () => {
    generation++;
    clearTimeout(deadline);
    if (pending >= 0) {
      const video = videos[pending];
      if (frame !== undefined) video.cancelVideoFrameCallback?.(frame);
      video.pause();
      if (pending !== active) {
        video.removeAttribute("src");
        video.load();
        states[pending] = undefined;
      }
    }
    pending = -1;
    frame = undefined;
  };

  const request = (state: MascotState) => {
    desired = state;
    if (disposed || suspended || pending >= 0 || failed.has(state)) return;
    if (active >= 0 && states[active] === state && !videos[active].paused) {
      onReady(state);
      return;
    }
    const index = active >= 0 && states[active] === state ? active : active === 0 ? 1 : 0;
    const video = videos[index];
    pending = index;
    const version = ++generation;
    const fail = () => {
      if (disposed || version !== generation) return;
      failed.add(state);
      cancelPending();
      if (active < 0 || index === active) onUnavailable();
    };
    const commit = () => {
      if (disposed || suspended || version !== generation) return;
      // Some browsers decode VP9 but not its alpha channel. Never replace the
      // native cursor with an opaque rectangle on those browsers.
      try {
        if (!context) return fail();
        context.clearRect(0, 0, 1, 1);
        context.drawImage(video, 0, 0, 1, 1, 0, 0, 1, 1);
        if (context.getImageData(0, 0, 1, 1).data[3] > 16) return fail();
      } catch {
        return fail();
      }
      clearTimeout(deadline);
      frame = undefined;
      pending = -1;
      if (active >= 0 && desired !== state) {
        video.pause();
        request(desired);
        return;
      }
      for (let i = 0; i < videos.length; i++) {
        videos[i].dataset.visible = String(i === index);
        if (i !== index) videos[i].pause();
      }
      active = index;
      onReady(state);
      if (desired !== state) request(desired);
    };
    video.muted = true;
    video.defaultMuted = true;
    video.onerror = () => {
      if (disposed) return;
      if (index === active) onUnavailable();
      else fail();
    };
    if (states[index] !== state) {
      video.src = mascotVideos[state];
      states[index] = state;
      video.load();
    }
    deadline = setTimeout(fail, 10000);
    void video.play().then(() => {
      if (disposed || version !== generation) return;
      if (video.requestVideoFrameCallback) frame = video.requestVideoFrameCallback(commit);
      else if (video.readyState >= 2) commit();
      else fail();
    }).catch(fail);
  };

  return {
    request,
    resume(state: MascotState) {
      suspended = false;
      request(active < 0 ? "idle" : state);
    },
    pause() {
      suspended = true;
      cancelPending();
      videos.forEach((video) => video.pause());
    },
    destroy() {
      disposed = true;
      cancelPending();
      videos.forEach((video) => {
        video.onerror = null;
        video.pause();
        video.removeAttribute("src");
        video.load();
      });
    },
  };
}
