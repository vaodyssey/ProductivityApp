import { MOCK_CAPSULES } from "@/constants/per-screen/index/constants";
import { determineMascotMood } from "@/services/habit-tracking/mood-service";
import { calculateAverageCompletionRate } from "@/services/habit-tracking/rate-calculator";
import { MoodStatus } from "@/types/mascot-mood";
import { useCallback, useEffect, useState } from "react";

export const useMascotMood = () => {
  const [moodStatus, setMoodStatus] = useState<MoodStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const calculateAndSetMood = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeCapsuleIds: string[] = MOCK_CAPSULES.map((c) => c.id);

      const calculationResult =
        await calculateAverageCompletionRate(activeCapsuleIds);
      console.log("Calculation Result:", calculationResult);

      const moodStatusDetermined = determineMascotMood({
        averageCompletionRate: calculationResult.averageCompletionRate,
        totalCapsulesChecked: calculationResult.totalCapsulesChecked,
      });

      setMoodStatus(moodStatusDetermined);
    } catch (error) {
      console.error("Error calculating habit mood:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    calculateAndSetMood();
  }, []);

  return { isLoading, moodStatus };
};
