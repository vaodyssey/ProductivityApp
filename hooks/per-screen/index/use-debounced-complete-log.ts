import { useCallback, useEffect, useRef } from "react";

type CompletionUpdate = {
  id: string;
  completed: boolean;
};

export function useDebouncedCompleteLog(
  flush: (updates: CompletionUpdate[]) => Promise<void>,
  delay = 1000,
) {
  // Buffer and timer live in refs so changing them doesn't re-render
  const bufferRef = useRef<Map<string, CompletionUpdate>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runFlush = useCallback(async () => {
    timerRef.current = null;
    if (bufferRef.current.size === 0) return;

    // Take the pending updates and clear the buffer before awaiting,
    // so clicks during the write start a fresh batch
    const updates = Array.from(bufferRef.current.values());
    bufferRef.current.clear();

    try {
      await flush(updates);
    } catch (e) {
      console.error("Bulk update failed:", e);
      // Put the failed updates back so the next flush retries them
      updates.forEach((u) => bufferRef.current.set(u.id, u));
    }
  }, [flush]);

  const scheduleUpdate = useCallback(
    (update: CompletionUpdate) => {
      // Keyed by id, so repeated clicks on one item keep only the latest state
      bufferRef.current.set(update.id, update);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(runFlush, delay);
    },
    [delay, runFlush],
  );

  // Flush anything pending when the component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      runFlush();
    };
  }, [runFlush]);

  return scheduleUpdate;
}
