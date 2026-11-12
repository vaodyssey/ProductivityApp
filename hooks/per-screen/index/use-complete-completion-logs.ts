import { CompletionLogWithImage } from "@/models/completion-log";
import CompletionLogRepository from "@/repository/completion-log-repository";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

interface UseCompleteCompletionLogsProps {
  completionLogRepository: CompletionLogRepository;
  dailyCompletionLogs: CompletionLogWithImage[];
}

export const useCompleteCompletionLogs = ({
  completionLogRepository,
  dailyCompletionLogs,
}: UseCompleteCompletionLogsProps) => {
  const [stagingCompletionLogs, setStagingCompletionLogs] =
    useState<CompletionLogWithImage[]>(dailyCompletionLogs);
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
  const toggleCompletion = (completionLogId: string) => {
    setStagingCompletionLogs((prevItems) =>
      prevItems.map((item) =>
        item.id === completionLogId
          ? { ...item, completed: !item.completed }
          : item,
      ),
    );
  };
  useFocusEffect(
    useCallback(() => {
      return () => {
        performBulkUpdate();
      };
    }, [stagingCompletionLogs]),
  );
  useEffect(() => {
    if (dailyCompletionLogs) setStagingCompletionLogs(dailyCompletionLogs);
  }, [dailyCompletionLogs]);
  return { stagingCompletionLogs, toggleCompletion };
};
