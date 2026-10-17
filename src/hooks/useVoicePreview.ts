import { useCallback, useEffect, useRef, useState } from "react";

const exampleText = "This made my evening. Keep creating!";
type Availability = "loading" | "ready" | "unavailable";

/** Explicitly triggered device speech; remote speech voices are never selected. */
export function useVoicePreview() {
  const [availability, setAvailability] = useState<Availability>("loading");
  const [isPlaying, setIsPlaying] = useState(false);
  const [notice, setNotice] = useState("Checking for a voice on this device.");
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const playbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);

  const cancelPlayback = useCallback(() => {
    generation.current++;
    if (playbackTimer.current) clearTimeout(playbackTimer.current);
    playbackTimer.current = null;
    if (utterance.current) {
      utterance.current.onend = null;
      utterance.current.onerror = null;
      utterance.current = null;
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      setAvailability("unavailable");
      setNotice(
        "Voice preview is unavailable on this device. You can still read the example message.",
      );
      return;
    }
    const speech = window.speechSynthesis;
    let resolved = false;
    const findVoice = () => {
      const allVoices = speech.getVoices();
      const localVoices = allVoices.filter(
        (candidate) => candidate.localService,
      );
      const selected =
        localVoices.find((candidate) => /^en(?:-|$)/i.test(candidate.lang)) ??
        localVoices[0];
      voice.current = selected ?? null;
      if (selected) {
        resolved = true;
        setAvailability("ready");
        if (!utterance.current)
          setNotice(
            "Device-generated example. Press Play to hear the message.",
          );
      } else if (allVoices.length || resolved) {
        resolved = true;
        setAvailability("unavailable");
        setNotice(
          "No local voice is available on this device. The example message is shown below.",
        );
      }
    };
    findVoice();
    speech.addEventListener("voiceschanged", findVoice);
    const availabilityTimer = setTimeout(() => {
      if (voice.current) return;
      resolved = true;
      setAvailability("unavailable");
      setNotice(
        "No local voice is available on this device. The example message is shown below.",
      );
    }, 1500);
    return () => {
      clearTimeout(availabilityTimer);
      speech.removeEventListener("voiceschanged", findVoice);
      cancelPlayback();
    };
  }, [cancelPlayback]);

  const stop = useCallback(() => {
    cancelPlayback();
    setIsPlaying(false);
    setNotice("Voice preview stopped.");
  }, [cancelPlayback]);

  const play = useCallback(() => {
    if (!voice.current) return;
    cancelPlayback();
    const version = generation.current;
    const speech = window.speechSynthesis;
    try {
      const message = new SpeechSynthesisUtterance(exampleText);
      message.voice = voice.current;
      message.lang = voice.current.lang;
      message.rate = 0.95;
      message.pitch = 1;
      message.volume = 0.65;
      utterance.current = message;
      setIsPlaying(true);
      setNotice("Playing a device-generated example voice.");
      message.onend = () => {
        if (version !== generation.current) return;
        if (playbackTimer.current) clearTimeout(playbackTimer.current);
        utterance.current = null;
        setIsPlaying(false);
        setNotice("Voice preview finished. Replay whenever you like.");
      };
      message.onerror = () => {
        if (version !== generation.current) return;
        cancelPlayback();
        setIsPlaying(false);
        setNotice(
          "This device could not play the voice. You can still read the example message.",
        );
      };
      playbackTimer.current = setTimeout(() => {
        if (version !== generation.current) return;
        cancelPlayback();
        setIsPlaying(false);
        setNotice(
          "Voice preview ended. You can replay it or read the example message.",
        );
      }, 20000);
      speech.speak(message);
    } catch {
      cancelPlayback();
      setIsPlaying(false);
      setNotice(
        "This device could not play the voice. You can still read the example message.",
      );
    }
  }, [cancelPlayback]);

  return { availability, isPlaying, notice, play, stop };
}
