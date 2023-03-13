import { useCallback, useEffect, useState } from "react";

type UseCooldownOptions = {
  duration: number;
};

export default function useCooldown(options: UseCooldownOptions) {
  const [completionRate, setCompletionRate] = useState(1);
  const [isCoolingDown, setIsCoolingDown] = useState(false);

  const start = useCallback(() => {
    setCompletionRate(0);
    setIsCoolingDown(true);
  }, []);

  const stop = useCallback(() => {
    setCompletionRate(1);
    setIsCoolingDown(false);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (isCoolingDown) {
      interval = setInterval(() => {
        setCompletionRate(inc);

        if (completionRate >= 1) {
          clearInterval(interval);
          setCompletionRate(1);
          setIsCoolingDown(false);
        }
      }, options.duration / 10);
    }

    return () => {
      interval && clearInterval(interval);
    };
  }, [isCoolingDown, completionRate, options.duration]);

  useEffect(() => {
    return () => {
      setCompletionRate(1);
      setIsCoolingDown(false);
    };
  }, []);

  return {
    start,
    stop,
    isCoolingDown,
    completionRate,
  };
}

function inc(n: number) {
  return round(clamp(n + 0.1, 0, 1));
}

function clamp(n: number, min: number, max: number) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

function round(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
