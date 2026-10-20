import Button from "@/components/ui/button";
import { COLOR_BLACK_1, COLOR_WHITE } from "@/constants/colors";
import {
  HABIT_CARD_HEIGHT,
  HABIT_CARD_WIDTH,
} from "@/constants/per-screen/index/constants";
import FONT_STYLES from "@/constants/text";
import { Capsule } from "@/models/capsule";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import React from "react";
import { Image, StyleSheet, Text, TextStyle, View } from "react-native";

interface HabitCardProps {
  capsule: Capsule;
}

const BackgroundOverlay = ({ capsule }: HabitCardProps) => {
  const opacity = Math.min(1, capsule.completedThisWeek / capsule.weeklyGoal);
  const habitSubInfo: TextStyle = {
    color: opacity < 0.7 ? COLOR_WHITE : COLOR_BLACK_1, //TODO: Enhance image background color detection here
  };
  return (
    <View
      style={[
        styles.backgroundOverlay,
        { backgroundColor: `rgba(0, 0, 0, ${1 - opacity})` }, // Darker overlay for lower completion
        // We will use a placeholder image here in the final version
      ]}
    >
      <View style={styles.habitInfo}>
        <Text style={[habitSubInfo, FONT_STYLES.H3_STYLE]}>
          {capsule.badHabitName}
        </Text>
        <Text style={[habitSubInfo, FONT_STYLES.H5_STYLE]}>Oct 20, 2026</Text>
      </View>
      <Button
        icon="checkmark-circle-outline"
        label={
          capsule.completedThisWeek >= capsule.weeklyGoal
            ? "Completed"
            : "Complete"
        }
      />
    </View>
  );
};

const HabitCard: React.FC<HabitCardProps> = ({ capsule }) => {
  // Calculate opacity based on performance (assuming weeklyGoal is available)
  // Opacity should be clamped between 0 and 1.
  return (
    <View style={styles.cardContainer}>
      <Image source={require("../../../assets/images/mascot.png")} />
      <BackgroundOverlay capsule={capsule} />
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
});

export default HabitCard;
