import { useEffect, useRef, useState } from "react";
export function useDemoSequence() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clear(), []);
  const reset = () => {
    clear();
    setStep(0);
    setRunning(false);
  };
  const play = () => {
    clear();
    setStep(1);
    setRunning(true);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 150
      : 750;
    timers.current = [
      setTimeout(() => setStep(2), delay),
      setTimeout(() => {
        setStep(3);
        setRunning(false);
      }, delay * 2),
    ];
  };
  return { step, running, play, reset };
}
