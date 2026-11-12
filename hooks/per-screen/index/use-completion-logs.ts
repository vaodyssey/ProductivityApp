import { HOME_ROUTE } from "@/constants/routes";
import { CompletionLogWithImage } from "@/models/completion-log";
import CapsuleRepository from "@/repository/capsule-repository";
import CompletionLogRepository from "@/repository/completion-log-repository";
import { getWeekRange, toDateString } from "@/utils/date";
import { useFocusEffect, usePathname } from "expo-router";
import { useCallback, useEffect, useState } from "react";

interface UseCompletionLogsProps {
  completionLogRepository: CompletionLogRepository;
  capsuleRepository: CapsuleRepository;
}
export const useCompletionLogs = ({
  capsuleRepository,
  completionLogRepository,
}: UseCompletionLogsProps) => {
  const pathName = usePathname();
  const [dailyCompletionLogs, setDailyCompletionLogs] = useState<
    CompletionLogWithImage[]
  >([]);
  const [weeklyCompletionLogs, setWeeklyCompletionLogs] =
    useState<CompletionLogWithImage[]>();

  const calculateOpacityForCompletionLogs = (
    tempWeeklyCompletionLogs: CompletionLogWithImage[],
  ) => {
    const completedCount = tempWeeklyCompletionLogs.reduce((count, log) => {
      return log.completed ? count + 1 : count;
    }, 0);
    return tempWeeklyCompletionLogs.map((wcl) => ({
      ...wcl,
      opacity: completedCount / tempWeeklyCompletionLogs.length,
    }));
  };
  const getDailyCompletionLogs = (
    tempWeeklyCompletionLogs: CompletionLogWithImage[],
  ) => {
    return tempWeeklyCompletionLogs
      .filter((cl) => cl.dateTime == toDateString(new Date()) && !cl.completed)
      .sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  };

  const getWeeklyCompletionLogs = async (capsuleId: string) => {
    const { startOfWeek, endOfWeek } = getWeekRange();
    const weeklyCompletionLogs = await completionLogRepository.getByDateRange(
      capsuleId,
      toDateString(startOfWeek),
      toDateString(endOfWeek),
    );
    return calculateOpacityForCompletionLogs(weeklyCompletionLogs);
  };

  const getCompletionLogs = async () => {
    const capsules = await capsuleRepository.getAll();
    if (!capsules) return [];
    const tempWeeklyCompletionLogs: CompletionLogWithImage[] = [];

    for (const capsule of capsules) {
      const completionLogsPerCapsule = await getWeeklyCompletionLogs(
        capsule.id,
      );

      tempWeeklyCompletionLogs.push(...completionLogsPerCapsule);
    }
    const tempDailyCompletionLogs = getDailyCompletionLogs(
      tempWeeklyCompletionLogs,
    );

    setDailyCompletionLogs(tempDailyCompletionLogs);
    setWeeklyCompletionLogs(tempWeeklyCompletionLogs);
  };
  useEffect(() => {
    console.log("this app is shiett: ", dailyCompletionLogs);
    console.log("this app is facking bullshiet: ", weeklyCompletionLogs);
  }, [dailyCompletionLogs, weeklyCompletionLogs]);

  useFocusEffect(
    useCallback(() => {
      console.log("ROUTENAMEEE: ", pathName);
      if (pathName !== HOME_ROUTE) return;
      getCompletionLogs();
    }, [pathName]),
  );

  return { dailyCompletionLogs, weeklyCompletionLogs };
};
