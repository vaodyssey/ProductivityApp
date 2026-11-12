import { CAPSULE_ID_PREFIX, COMPLETION_LOG_PREFIX } from "@/constants/database";
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
  let latestCapsuleId = await capsuleRepository.getLatestId();
  if (!latestCapsuleId) latestCapsuleId = `${CAPSULE_ID_PREFIX}_0001`;
  else latestCapsuleId = bumpId(latestCapsuleId);

  let latestCompletionLogId = await completionLogRepository.getLatestId();

  if (!latestCompletionLogId)
    latestCompletionLogId = `${COMPLETION_LOG_PREFIX}_0001`;
  else latestCompletionLogId = bumpId(latestCompletionLogId);
  const completionLogs = weekDates.map((dateTime) => {
    const completionLog: CompletionLog = {
      id: latestCompletionLogId,
      dateTime,
      completed: false,
      capsuleId: latestCapsuleId,
    } as CompletionLog;
    latestCompletionLogId = bumpId(latestCompletionLogId);
    return completionLog;
  });
  await completionLogRepository.bulkCreate(completionLogs);
  capsule.id = latestCapsuleId;
  await capsuleRepository.create(capsule);
}
