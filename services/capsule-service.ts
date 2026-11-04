import { Capsule } from "@/models/capsule";
import { CompletionLog } from "@/models/completion-log";
import CapsuleRepository from "@/repository/capsule-repository";
import CompletionLogRepository from "@/repository/completion-log-repository";
import { bumpId } from "@/utils/database";
import { getWeekDateTimes } from "@/utils/date";

interface CreateCapsuleProps {
  completionLogRepository: CompletionLogRepository;
  capsuleRepository: CapsuleRepository;
  capsule: Capsule;
  selectedDays: number[];
}

export async function createCapsule({
  capsuleRepository,
  completionLogRepository,
  capsule,
  selectedDays,
}: CreateCapsuleProps) {
  const weekDates = getWeekDateTimes(selectedDays);
  // e.g. ["2026-10-25", "2026-10-26", ..., "2026-10-31"]
  console.log("weekdates: ", weekDates);
  const latestCapsuleId = await capsuleRepository.getLatestId();
  const latestCompletionLogId = await completionLogRepository.getLatestId();
  let latestId: string = latestCompletionLogId;
  const completionLogs = weekDates.map((dateTime) => {
    // const completionLogId = formatId(COMPLETION_LOG_PREFIX, COMPLETION_LOG_DIGITS, )
    const completionLog: CompletionLog = {
      id: latestId,
      dateTime,
      completed: false,
      capsuleId: latestCapsuleId,
    } as CompletionLog;
    latestId = bumpId(latestId);
    return completionLog;
  });
  await completionLogRepository.bulkCreate(completionLogs);
  capsule.id = latestCapsuleId;
  await capsuleRepository.create(capsule);
}
