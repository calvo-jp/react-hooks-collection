import { useCallback, useState } from "react";

type useBooleanOptions = {
  defaultValue?: boolean;
};

type UseBooleanReturn = [
  flag: boolean,
  setFlag: {
    on(): void;
    off(): void;
    toggle(): void;
  },
];

export default function useBoolean(
  options?: useBooleanOptions,
): UseBooleanReturn {
  const [state, setState] = useState(!!options?.defaultValue);

  const on = useCallback(() => {
    setState(true);
  }, []);

  const off = useCallback(() => {
    setState(false);
  }, []);

  const toggle = useCallback(() => {
    setState((s) => !s);
  }, []);

  return [state, { on, off, toggle }];
}
