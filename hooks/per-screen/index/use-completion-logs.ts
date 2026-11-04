import { CompletionLogWithImage } from "@/models/completion-log";
import CapsuleRepository from "@/repository/capsule-repository";
import CompletionLogRepository from "@/repository/completion-log-repository";
import { getWeekRange, toDateString } from "@/utils/date";
import { useEffect, useState } from "react";

interface UseCompletionLogsProps {
  completionLogRepository: CompletionLogRepository;
  capsuleRepository: CapsuleRepository;
}
export const useCompletionLogs = ({
  capsuleRepository,
  completionLogRepository,
}: UseCompletionLogsProps) => {
  const [todayCompletionLogs, setTodayCompletionLogs] =
    useState<CompletionLogWithImage[]>();
  const [weeklyCompletionLogs, setWeeklyCompletionLogs] =
    useState<CompletionLogWithImage[]>();
  const getCompletionLogs = async () => {
    const { startOfWeek, endOfWeek } = getWeekRange();
    const bruh = await completionLogRepository.getAll();
    console.log("bruh: ", bruh);
    const weeklyCompletionLogs = await completionLogRepository.getByDateRange(
      "CS_0001",
      toDateString(startOfWeek),
      toDateString(endOfWeek),
    );
    const completedCount = weeklyCompletionLogs.reduce((count, log) => {
      return log.completed ? count + 1 : count;
    }, 0);
    const withOpacityWeeklyCompletionLogs = weeklyCompletionLogs.map((wcl) => ({
      ...wcl,
      opacity: completedCount / weeklyCompletionLogs.length,
    }));
    console.log("completedCount: ", completedCount);
    console.log(`withOpacityWeekly: `, withOpacityWeeklyCompletionLogs);
    const todayCompletionLogs = withOpacityWeeklyCompletionLogs
      .filter((cl) => cl.dateTime <= toDateString(new Date()))
      .sort((a, b) => b.dateTime.localeCompare(a.dateTime));
    setTodayCompletionLogs(todayCompletionLogs);
    setWeeklyCompletionLogs(weeklyCompletionLogs);
  };
  useEffect(() => {
    console.log("this app is shiett: ", todayCompletionLogs);
    console.log("this app is facking bullshiet: ", weeklyCompletionLogs);
  }, [todayCompletionLogs, weeklyCompletionLogs]);
  useEffect(() => {
    getCompletionLogs();
  }, []);
  return { todayCompletionLogs, weeklyCompletionLogs };
};
