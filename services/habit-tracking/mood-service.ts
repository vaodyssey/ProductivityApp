import { MascotMood, MoodStatus } from "@/types/mascot-mood";
import { AverageRateCalculationResult } from "@/types/rate-calculator";

/**
 * Determines the mascot's mood based on the calculated average completion rate.
 * @param result The result from calculateAverageCompletionRate.
 * @returns A structured object containing the determined mood, message, and emoji.
 */
export function determineMascotMood(
  result: AverageRateCalculationResult,
): MoodStatus {
  const avgRate = result.averageCompletionRate;

  let mood: MascotMood;
  let message: string;
  let emoji: string;

  if (avgRate >= 0.8) {
    mood = MascotMood.HAPPY;
    message = "Fantastic consistency! Keep up the amazing habit streak.";
    emoji = "😄";
  } else if (avgRate >= 0.5 && avgRate < 0.8) {
    mood = MascotMood.NEUTRAL;
    message =
      "Solid progress, but a few habits slipped this week. Maintain the effort!";
    emoji = "🙂";
  } else {
    // Below 0.5
    mood = MascotMood.SAD;
    message =
      "It looks like things slowed down. Let's revisit your goals and focus on one habit this week.";
    emoji = "😟";
  }

  return { mood, message, emoji };
}
