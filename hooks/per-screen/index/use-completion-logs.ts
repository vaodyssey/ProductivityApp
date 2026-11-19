import { CompletionLogWithImage } from "@/models/completion-log";
import CapsuleRepository from "@/repository/capsule-repository";
import CompletionLogRepository from "@/repository/completion-log-repository";
import { getWeekRange, toDateString } from "@/utils/date";
import { useFocusEffect, usePathname } from "expo-router";
import { useCallback, useState } from "react";

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
  const [averageCompletionRate, setAverageCompletionRate] = useState<number>(0);

  const [atLeastOneCapsuleExists, setAtLeastOneCapsuleExists] =
    useState<boolean>(false);

  const calculateCompletionRate = (
    tempWeeklyCompletionLogs: CompletionLogWithImage[],
  ) => {
    const completedCount = tempWeeklyCompletionLogs.reduce((count, log) => {
      return log.completed ? count + 1 : count;
    }, 0);
    const completionRate = completedCount / tempWeeklyCompletionLogs.length;
    return {
      completionRatePerCapsule: completionRate,
      weeklyCompletionRatePerCapsule: tempWeeklyCompletionLogs.map((wcl) => ({
        ...wcl,
        completionRate: completionRate,
      })),
    };
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
    return calculateCompletionRate(weeklyCompletionLogs);
  };

  const getCompletionLogs = async () => {
    const capsules = await capsuleRepository.getAll();
    if (!capsules || (capsules && capsules.length === 0)) return;
    const tempWeeklyCompletionLogs: CompletionLogWithImage[] = [];
    let totalCompletionRate = 0;

    for (const capsule of capsules) {
      const { completionRatePerCapsule, weeklyCompletionRatePerCapsule } =
        await getWeeklyCompletionLogs(capsule.id);
      totalCompletionRate += completionRatePerCapsule;
      tempWeeklyCompletionLogs.push(...weeklyCompletionRatePerCapsule);
    }
    const tempDailyCompletionLogs = getDailyCompletionLogs(
      tempWeeklyCompletionLogs,
    );
    setAverageCompletionRate(totalCompletionRate / capsules.length);
    setDailyCompletionLogs(tempDailyCompletionLogs);
    setAtLeastOneCapsuleExists(true);
  };

  useFocusEffect(
    useCallback(() => {
      getCompletionLogs();
    }, []),
  );
  // useEffect(() => {
  //   console.log("ROUTENAMEEE: ", pathName);
  //   if (pathName !== HOME_ROUTE) return;
  //   getCompletionLogs();
  // }, [pathName]);

  return {
    atLeastOneCapsuleExists,
    dailyCompletionLogs,
    averageCompletionRate,
  };
};
