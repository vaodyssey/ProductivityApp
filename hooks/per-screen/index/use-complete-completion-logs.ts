import { CompletionLogWithImage } from "@/models/completion-log";
import CompletionLogRepository from "@/repository/completion-log-repository";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseCompleteCompletionLogsProps {
  completionLogRepository: CompletionLogRepository;
  dailyCompletionLogs: CompletionLogWithImage[];
}

export const useCompleteCompletionLogs = ({
  completionLogRepository,
  dailyCompletionLogs,
}: UseCompleteCompletionLogsProps) => {
  const [stagingCompletionLogs, setStagingCompletionLogs] = useState<
    CompletionLogWithImage[]
  >([]);
  const performBulkUpdateRef = useRef<() => void>(() => {});

  const performBulkUpdate = () => {
    //Fields are intentionally left empty as they're not needed in the bulk complete function.
    const mappedCompletionLogs = stagingCompletionLogs.map((scl) => ({
      capsuleId: "",
      id: scl.id,
      completed: scl.completed as boolean,
      dateTime: scl.dateTime,
    }));
    completionLogRepository.bulkComplete(mappedCompletionLogs);
  };
  performBulkUpdateRef.current = performBulkUpdate;

  const toggleCompletion = (completionLogId: string) => {
    setStagingCompletionLogs((prevItems) =>
      prevItems.map((item) =>
        item.id === completionLogId
          ? { ...item, completed: !item.completed }
          : item,
      ),
    );
  };

  /* useCallback freezes the performBulkUpdateRef - a box containing the performBulkUpdate). 
  However, IT DOES NOT freeze the function inside it (performBulkUpdate). This achieves 2 things
   - Prevents performBulkUpdate from firing (by putting stagingCompletionLogs changes in useCallback deps array)
   - Ensures performBulkUpdate is re-created (within the box) (performBulkUpdateRef.current) 
     > having latest stagingCompletionLogs > no more stale data.
  */
  useFocusEffect(
    useCallback(() => {
      return () => {
        performBulkUpdateRef.current();
      };
    }, []),
  );

  // dailyCompletionLogs is asynchronously fetched (not available immediately),
  // so it's best to re-populate stagingCompletionLogs when dailyCompletionLogs is ready again.
  useEffect(() => {
    if (dailyCompletionLogs) setStagingCompletionLogs(dailyCompletionLogs);
  }, [dailyCompletionLogs]);

  return { stagingCompletionLogs, toggleCompletion };
};
