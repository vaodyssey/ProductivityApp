import { determineMascotMood } from "@/services/habit-tracking/mood-service";
import { MascotMood, MoodStatus } from "@/types/mascot-mood";
import { useCallback, useEffect, useState } from "react";

interface UseMascotMoodProps {
  averageCompletionRate: number;
}
export const useMascotMood = ({
  averageCompletionRate,
}: UseMascotMoodProps) => {
  const [moodStatus, setMoodStatus] = useState<MoodStatus>({
    emoji: "",
    message: "",
    mood: MascotMood.HAPPY,
  });
  const [isLoading, setIsLoading] = useState(true);

  const calculateAndSetMood = useCallback(() => {
    setIsLoading(true);
    try {
      const moodStatusDetermined = determineMascotMood(averageCompletionRate);
      setMoodStatus(moodStatusDetermined);
    } catch (error) {
      console.error("Error calculating habit mood:", error);
    } finally {
      setIsLoading(false);
    }
  }, [averageCompletionRate]);

  useEffect(() => {
    calculateAndSetMood();
  }, [averageCompletionRate]);

  return { isLoading, moodStatus };
};
