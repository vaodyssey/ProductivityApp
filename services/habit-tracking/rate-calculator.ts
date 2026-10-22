import { completionLogRepository } from "@/repository/completion-log-repository";
import { AverageRateCalculationResult } from "@/types/rate-calculator";

/**
 * Calculates the average weekly completion rate across all provided capsules.
 * @param activeCapsuleIds Array of IDs for capsules to check.
 * @returns A Promise resolving to the calculated AverageRateCalculationResult.
 */
export async function calculateAverageCompletionRate(
  activeCapsuleIds: string[],
): Promise<AverageRateCalculationResult> {
  if (!activeCapsuleIds || activeCapsuleIds.length === 0) {
    return { averageCompletionRate: 0, totalCapsulesChecked: 0 };
  }

  // Determine the current week's date range for DAL call (requires a utility function/helper)
  const today = new Date();
  // In a real app, we would calculate the start of the week (e.g., Sunday or Monday).
  // For this implementation draft, we will pass a mock week window.
  const startDate = new Date(
    today.getFullYear(),
    Math.max(0, Math.floor((today.getDay() - 1) / 7) * 7) -
      ((today.getDay() - 1) % 7),
    today.getDate(),
  ); // Simplified start of week logic placeholder
  const endDate = new Date();

  let totalRatesSum: number = 0;
  let capsulesCheckedCount: number = 0;

  for (const capsuleId of activeCapsuleIds) {
    // Phase 1: Data Retrieval - Use the dedicated DAL
    const completionLogs = await completionLogRepository.getLogsForWeek(
      capsuleId,
      startDate,
      endDate,
    );

    // Phase 2: Individual Rate Calculation
    let totalTimesPerWeek = completionLogs.length;
    let successfulCompletions = 0;

    if (totalTimesPerWeek === 0) {
      // If no logs exist for the week, we assume a rate of 0 but still count it towards the average check if the capsule is active.
      console.log(
        `[RateCalc] Warning: No logs found for ${capsuleId} this week.`,
      );
    } else {
      for (const log of completionLogs) {
        if (log.completed === true) {
          successfulCompletions++;
        }
      }
    }

    // Calculate individual rate, handling division by zero defensively
    let singleRate: number = 0;
    if (totalTimesPerWeek > 0) {
      singleRate = successfulCompletions / totalTimesPerWeek;
    }

    console.log(
      `[RateCalc] ${capsuleId}: Logs=${totalTimesPerWeek}, Successes=${successfulCompletions}, Rate=${(singleRate * 100).toFixed(2)}%`,
    );

    // Accumulate for average calculation
    totalRatesSum += singleRate;
    capsulesCheckedCount++;
  }

  // Final Average Rate Calculation
  const averageCompletionRate =
    capsulesCheckedCount > 0 ? totalRatesSum / capsulesCheckedCount : 0;

  return {
    averageCompletionRate: parseFloat(averageCompletionRate.toFixed(2)),
    totalCapsulesChecked: capsulesCheckedCount,
  };
}
