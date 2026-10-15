import Button from "@/components/ui/button";
import { HABIT_CARD_WIDTH } from "@/constants/per-screen/index/constants";
import { Capsule } from "@/models/capsule";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface HabitCardProps {
  capsule: Capsule;
}

const BackgroundOverlay = ({ capsule }: HabitCardProps) => {
  const opacity = Math.min(1, capsule.completedThisWeek / capsule.weeklyGoal);
  return (
    <View
      style={[
        styles.backgroundOverlay,
        { backgroundColor: `rgba(0, 0, 0, ${1 - opacity})` }, // Darker overlay for lower completion
        // We will use a placeholder image here in the final version
      ]}
    >
      <View style={styles.contentArea}>
        {/* Habit Name (Top Left) */}
        <Text style={styles.habitName}>{capsule.badHabitName}</Text>

        {/* Complete/Revert Button Area (Bottom) */}
        <Button
          label={
            capsule.completedThisWeek >= capsule.weeklyGoal
              ? "Completed"
              : "Complete"
          }
        />
      </View>
    </View>
  );
};

const HabitCard: React.FC<HabitCardProps> = ({ capsule }) => {
  // Calculate opacity based on performance (assuming weeklyGoal is available)
  // Opacity should be clamped between 0 and 1.

  return (
    <View style={styles.cardContainer}>
      <Image
        source={require("../../../assets/images/mascot.png")}
        style={styles.bgImage}
      />

      <BackgroundOverlay capsule={capsule} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#f0f0f0", // Base background color
    width: HABIT_CARD_WIDTH,
    borderRadius: 12, // Using a rounded corner style
    overflow: "hidden", // Ensures the overlay respects borders
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: "relative",
  },
  backgroundOverlay: {
    flex: 1,
    padding: SCREEN_WIDTH * 0.05,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  contentArea: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between", // Pushes name to top and button to bottom
  },
  bgImage: {},
  habitName: {
    fontSize: 18, // H3 style approximation
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20, // Space between name and button
  },
});

export default HabitCard;
