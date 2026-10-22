import { LinearGradientBackground } from "@/components/linear-gradient-bg";
import { COLOR_PRIMARY, LINEAR_GRADIENT_2 } from "@/constants/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import {
  FLATLIST_SNAP_INTERVAL,
  GAP_BETWEEN_HABIT_CARDS,
  HABIT_CARD_HEIGHT,
  MOCK_CAPSULES,
  PROGRESS_BUDDY_PHRASE,
} from "@/constants/per-screen/index/constants";
import FONT_STYLES from "@/constants/text";

import HorizontalSwiper from "@/components/HorizontalSwiper";
import Button from "@/components/ui/button";
import { Capsule } from "@/models/capsule";
import { ToggleScrollViewProps } from "@/types/toggle-scroll-view-props";

import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import HabitCard from "./HabitCard";

export const ProgressBuddy = ({ scrollViewRef }: ToggleScrollViewProps) => {
  // const { isLoading, moodStatus } = useMascotMood();
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
        <View style={{ flex: 10 }}>
          <HorizontalSwiper
            style={styles.habitCardsScrollView}
            pages={[
              {
                key: "mascot",
                component: (
                  <View
                    style={{
                      justifyContent: "center",
                      width: SCREEN_WIDTH * 0.8,
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      source={require("../../../assets/images/mascot.png")}
                      style={styles.mascot}
                    />
                  </View>
                ),
              },
              {
                key: "todo-list",
                component: (
                  <View>
                    <FlatList
                      data={MOCK_CAPSULES}
                      style={{ height: HABIT_CARD_HEIGHT, borderRadius: 12 }}
                      contentContainerStyle={{ gap: GAP_BETWEEN_HABIT_CARDS }}
                      nestedScrollEnabled
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
                  </View>
                ),
              },
            ]}
          />
        </View>
        <Button
          icon="happy-outline"
          style={{ width: SCREEN_WIDTH * 0.45 }}
          label="Weekly Highlights"
          onPress={() =>
            scrollViewRef?.current?.scrollTo({
              y: SCREEN_HEIGHT,
              animated: true,
            })
          }
        />
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

    flexDirection: "column",
    // width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    // justifyContent: "center",
    // alignItems: "center",
    // paddingHorizontal: SCREEN_WIDTH * 0.06,
    // paddingVertical: SCREEN_HEIGHT * 0.2,
    // gap: SCREEN_HEIGHT * 0.08,
  },
  phrase: {
    color: COLOR_PRIMARY,
    textAlign: "center",
    flex: 1, // Allows phrase to take up space
  },

  habitCardsScrollView: {
    width: SCREEN_WIDTH * 0.8,
    // flex: 1,
  },

  mascot: {
    // width: SCREEN_WIDTH * 0.6,
    // resizeMode: "contain",
    justifyContent: "center",
  },
  hint: {
    color: COLOR_PRIMARY,
    opacity: 0.6,
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: SCREEN_HEIGHT * 0.1,
  },
  horizontalScrollContainer: {
    flexDirection: "row", // Enables horizontal scrolling of cards
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    justifyContent: "space-between",
    alignItems: "center",
    height: SCREEN_HEIGHT,
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
  containerItem: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.1,
    top: 0,
  },
});
