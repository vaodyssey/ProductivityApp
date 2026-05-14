import { useNavigation } from "expo-router";
import { useEffect } from "react";

interface UseChangeScreenTitleProps {
  newTitle: string;
  shouldApply: boolean;
}
export const useChangeScreenTitle = ({
  newTitle,
  shouldApply,
}: UseChangeScreenTitleProps) => {
  const navigation = useNavigation();
  useEffect(() => {
    // Example: updating title after fetching data
    shouldApply && navigation.setOptions({ title: newTitle });
  }, [navigation]);
};
