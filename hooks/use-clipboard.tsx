import { useCallback, useEffect, useState } from "react";

export default function useClipboard(initialValue: string = "") {
  const [value, setValue] = useState(initialValue);
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = useCallback(
    async function handleCopy() {
      try {
        await navigator.clipboard.writeText(value);
        setHasCopied(true);
      } catch {
        console.error("'navigator.clipboard.writeText' failed");
      }
    },
    [value],
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (hasCopied) {
      timeout = setTimeout(() => {
        setHasCopied(false);
      }, 1500);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [hasCopied]);

  useEffect(() => {
    return () => {
      setValue(initialValue);
      setHasCopied(false);
    };
  }, [initialValue]);

  return {
    value,
    setValue,
    onCopy,
    hasCopied,
  };
}
