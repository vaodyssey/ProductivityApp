import {
  COLOR_BRONZE,
  COLOR_GOLD,
  COLOR_GREY,
  COLOR_SILVER,
  COLOR_WHITE,
} from "@/constants/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import {
  MOCK_CAPSULES,
  TOP_HABITS_COUNT,
} from "@/constants/per-screen/index/constants";
import FONT_STYLES from "@/constants/text";
import { Capsule } from "@/models/capsule";
import React from "react";
import { ColorValue, Image, StyleSheet, Text, View } from "react-native";

const sortCapsules = (capsules: Capsule[]): Capsule[] =>
  [...capsules].sort((a, b) => {
    if (b.completedThisWeek !== a.completedThisWeek)
      return b.completedThisWeek - a.completedThisWeek;
    return a.badHabitName.localeCompare(b.badHabitName);
  });

const TopHabitItem = ({
  capsule,
  rank,
}: {
  capsule: Capsule;
  rank: number;
}) => {
  const habitBoxHeightMap: Record<number, number> = {
    1: SCREEN_HEIGHT * 0.2,
    2: SCREEN_HEIGHT * 0.15,
    3: SCREEN_HEIGHT * 0.1,
  };
  const rankCircleStyleMap: Record<number, ColorValue> = {
    1: COLOR_GOLD,
    2: COLOR_SILVER,
    3: COLOR_BRONZE,
  };
  return (
    <View style={styles.topHabitItem}>
      <View
        style={{
          backgroundColor: rankCircleStyleMap[rank],
          ...styles.rankCircle,
        }}
      >
        <Text style={[styles.completedCount, FONT_STYLES.H3_STYLE]}>
          {rank}
        </Text>
      </View>
      <View style={{ ...styles.habitBox, height: habitBoxHeightMap[rank] }}>
        <Text style={[styles.habitName, FONT_STYLES.H4_STYLE]}>
          {capsule.badHabitName}
        </Text>
        <Text style={[styles.completedCount, FONT_STYLES.H3_STYLE]}>
          {capsule.completedThisWeek}
        </Text>
      </View>
    </View>
  );
};

const RemainingHabitItem = ({ capsule }: { capsule: Capsule }) => {
  return (
    <View style={styles.remainingItem}>
      <View style={styles.avatarCircle}>
        <Image
          source={require("../../../assets/images/favicon.png")}
          style={styles.avatarImage}
        />
      </View>
      <Text
        style={[styles.remainingName, FONT_STYLES.H4_STYLE]}
        numberOfLines={1}
      >
        {capsule.badHabitName}
      </Text>
      <Text style={[styles.remainingCount, FONT_STYLES.H4_STYLE]}>
        {capsule.completedThisWeek}
      </Text>
    </View>
  );
};

export const MyTopHabits = () => {
  const sorted = sortCapsules(MOCK_CAPSULES);
  const top3 = sorted.slice(0, TOP_HABITS_COUNT);
  const remaining = sorted.slice(TOP_HABITS_COUNT, TOP_HABITS_COUNT + 2);

  return (
    <View style={{ ...styles.container }}>
      <Text style={[styles.leaderboardTitle, FONT_STYLES.H1_STYLE]}>
        This week's Leaderboard
      </Text>
      <View style={styles.top3Section}>
        {top3.map((capsule, index) => (
          <TopHabitItem key={capsule.id} capsule={capsule} rank={index + 1} />
        ))}
      </View>
      <View style={styles.remainingSection}>
        {remaining.map((capsule) => (
          <RemainingHabitItem key={capsule.id} capsule={capsule} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    paddingVertical: SCREEN_HEIGHT * 0.01,
    gap: SCREEN_HEIGHT * 0.1,
  },
  leaderboardTitle: {
    textAlign: "center",
  },
  top3Section: {
    gap: SCREEN_WIDTH * 0.025,
    flexDirection: "row",
  },
  topHabitItem: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rankCircle: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    borderRadius: SCREEN_WIDTH * 0.1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  habitBox: {
    backgroundColor: COLOR_WHITE,
    borderTopLeftRadius: SCREEN_WIDTH * 0.05,
    borderTopRightRadius: SCREEN_WIDTH * 0.05,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    width: SCREEN_WIDTH * 0.28,
    gap: SCREEN_HEIGHT * 0.008,
    justifyContent: "space-between",
  },
  habitName: {
    textAlign: "center",
  },
  completedCount: {
    textAlign: "center",
  },
  remainingSection: {
    gap: SCREEN_HEIGHT * 0.015,
  },
  remainingItem: {
    flexDirection: "row",
    alignItems: "center",
    width: SCREEN_WIDTH * 0.9,
    gap: SCREEN_WIDTH * 0.04,
    backgroundColor: COLOR_WHITE,
    borderRadius: SCREEN_WIDTH * 0.05,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_HEIGHT * 0.012,
  },
  avatarCircle: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderRadius: SCREEN_WIDTH * 0.05,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  remainingName: {
    flex: 1,
  },
  remainingCount: {
    color: COLOR_GREY,
  },
});
