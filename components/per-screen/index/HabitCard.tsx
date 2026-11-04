import Button from "@/components/ui/button";
import { COLOR_BLACK_1, COLOR_WHITE } from "@/constants/colors";
import {
  HABIT_CARD_HEIGHT,
  HABIT_CARD_WIDTH,
} from "@/constants/per-screen/index/constants";
import FONT_STYLES from "@/constants/text";
import { CompletionLogWithImage } from "@/models/completion-log";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import React from "react";
import { Image, StyleSheet, Text, TextStyle, View } from "react-native";

interface HabitCardProps {
  completionLog: CompletionLogWithImage;
}

const BackgroundOverlay = ({ completionLog }: HabitCardProps) => {
  const opacity = completionLog.opacity;
  const habitSubInfo: TextStyle = {
    color: opacity < 0.7 ? COLOR_WHITE : COLOR_BLACK_1, //TODO: Enhance image background color detection here
  };
  return (
    <View
      style={[
        styles.backgroundOverlay,
        { backgroundColor: `rgba(0, 0, 0, ${1 - opacity})` },
      ]}
    >
      <View style={styles.habitInfo}>
        <Text style={[habitSubInfo, FONT_STYLES.H3_STYLE]}>
          {completionLog.goodHabitName}
        </Text>
        <Text style={[habitSubInfo, FONT_STYLES.H5_STYLE]}>
          {completionLog.dateTime}
        </Text>
      </View>
      <Button icon="checkmark-circle-outline" label={"Complete"} />
    </View>
  );
};

const HabitCard: React.FC<HabitCardProps> = ({ completionLog }) => {
  // Calculate opacity based on performance (assuming weeklyGoal is available)
  // Opacity should be clamped between 0 and 1.
  return (
    <View style={styles.cardContainer}>
      <Image
        source={{
          uri:
            completionLog.goodImageUrl ?? "../../../assets/images/mascot.png",
        }}
        style={styles.imageStyle}
      />
      <BackgroundOverlay completionLog={completionLog} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#f0f0f0", // Base background color
    width: HABIT_CARD_WIDTH,
    height: HABIT_CARD_HEIGHT,
    borderRadius: 12, // Using a rounded corner style
    overflow: "hidden", // Ensures the overlay respects borders
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backgroundOverlay: {
    flex: 1,
    padding: SCREEN_WIDTH * 0.05,
    justifyContent: "space-between", // Pushes name to top and button to bottom
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  habitInfo: {
    flex: 1,
    flexDirection: "column",
  },
  imageStyle: {
    width: "100%",
    height: "100%",
  },
});

export default HabitCard;
