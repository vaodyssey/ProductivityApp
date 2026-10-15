import { LinearGradientBackground } from "@/components/linear-gradient-bg";
import { COLOR_PRIMARY, LINEAR_GRADIENT_2 } from "@/constants/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import {
  FLATLIST_SNAP_INTERVAL,
  GAP_BETWEEN_HABIT_CARDS,
  MOCK_CAPSULES,
  PROGRESS_BUDDY_HINT,
  PROGRESS_BUDDY_PHRASE,
} from "@/constants/per-screen/index/constants";
import FONT_STYLES from "@/constants/text";

import Button from "@/components/ui/button";
import { Capsule } from "@/models/capsule";
import React, { useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import HabitCard from "./HabitCard";

export const ProgressBuddy = () => {
  const [isBuddyMode, setIsBuddyMode] = useState(true);

  return (
    <LinearGradientBackground
      colors={LINEAR_GRADIENT_2}
      start={{ x: 0.6, y: 0.3 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={{ ...styles.container }}>
        <Text style={[styles.phrase, FONT_STYLES.H1_STYLE]}>
          {PROGRESS_BUDDY_PHRASE}
        </Text>
        <View style={styles.mainContainer}>
          {isBuddyMode ? (
            <Image
              source={require("../../../assets/images/mascot.png")}
              style={styles.mascot}
            />
          ) : (
            // To-do Mode View: Horizontal scroll of HabitCards
            <FlatList
              data={MOCK_CAPSULES}
              style={styles.habitCardsFlatList}
              contentContainerStyle={styles.habitCardFlatlistContainer}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={FLATLIST_SNAP_INTERVAL} // Distance between snapping stops
              snapToAlignment="center" // Aligns snapped item to "start", "center", or "end"
              decelerationRate="fast"
              renderItem={(listRenderItem) => (
                <HabitCard
                  key={listRenderItem.item.id}
                  capsule={listRenderItem.item}
                />
              )}
              keyExtractor={(capsule: Capsule) => capsule.id} // Provides a unique key for tracking elements
            />
          )}
          <Button
            label={isBuddyMode ? "My To-dos" : "My Buddy"}
            onPress={() => setIsBuddyMode(!isBuddyMode)}
          />
        </View>
        <Text style={[styles.hint, FONT_STYLES.H5_STYLE]}>
          {PROGRESS_BUDDY_HINT}
        </Text>
      </View>
    </LinearGradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SCREEN_HEIGHT * 0.15,
  },
  phrase: {
    color: COLOR_PRIMARY,
    textAlign: "center",
    flex: 1, // Allows phrase to take up space
  },

  habitCardsFlatList: {
    width: SCREEN_WIDTH * 0.8,
  },
  habitCardFlatlistContainer: {
    gap: GAP_BETWEEN_HABIT_CARDS,
  },
  mainContainer: {
    flex: 4, // Takes up most of the middle screen space
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: SCREEN_HEIGHT * 0.1,
  },
  mascot: {
    width: SCREEN_WIDTH * 0.6,
    resizeMode: "contain",
  },
  hint: {
    color: COLOR_PRIMARY,
    opacity: 0.6,
    // This hint is only visible in Buddy Mode (handled by conditional rendering)
  },
  horizontalScrollContainer: {
    flexDirection: "row", // Enables horizontal scrolling of cards
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleButton: {
    width: "90%", // Make button wide enough to be prominent
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  toggleButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
