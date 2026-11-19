import Spinner from "@/components/ui/spinner";
import { useMascotMood } from "@/hooks/per-screen/index/use-mascot-mood";
import { MascotMood } from "@/types/mascot-mood";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

interface MascotDisplayProps {
  averageCompletionRate: number;
}
const mascotImageByMood: Record<MascotMood, ImageSourcePropType> = {
  [MascotMood.HAPPY]: require("@assets/images/mascot.gif"),
  [MascotMood.NEUTRAL]: require("@assets/images/react-logo.png"),
  [MascotMood.SAD]: require("@assets/images/splash-icon.png"),
};
export const MascotDisplay = ({
  averageCompletionRate,
}: MascotDisplayProps) => {
  const { isLoading, moodStatus } = useMascotMood({
    averageCompletionRate: averageCompletionRate ?? 0,
  });

  const activeMascot = mascotImageByMood[moodStatus.mood];

  return (
    <View>
      {isLoading ? (
        <Spinner />
      ) : (
        <Image source={activeMascot} style={styles.mascot} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mascot: {
    justifyContent: "center",
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
  },
});
