import { LinearGradientBackground } from "@/components/linear-gradient-bg";
import { COLOR_PRIMARY, LINEAR_GRADIENT_2 } from "@/constants/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import {
  FLATLIST_SNAP_INTERVAL,
  GAP_BETWEEN_HABIT_CARDS,
  HABIT_CARD_HEIGHT,
  PROGRESS_BUDDY_PHRASE,
} from "@/constants/per-screen/index/constants";
import FONT_STYLES from "@/constants/text";

import HorizontalSwiper from "@/components/HorizontalSwiper";
import Button from "@/components/ui/button";
import { useCompleteCompletionLogs } from "@/hooks/per-screen/index/use-complete-completion-logs";
import { useCompletionLogs } from "@/hooks/per-screen/index/use-completion-logs";
import { CompletionLogWithImage } from "@/models/completion-log";
import CapsuleRepository from "@/repository/capsule-repository";
import CompletionLogRepository from "@/repository/completion-log-repository";
import { ToggleScrollViewProps } from "@/types/toggle-scroll-view-props";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { FlatList, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateCapsuleNav } from "./create-capsule-nav";
import HabitCard from "./habit-card";
import { MascotDisplay } from "./mascot-display";

export const ProgressBuddy = ({ scrollViewRef }: ToggleScrollViewProps) => {
  const router = useRouter();
  const db = useSQLiteContext();
  const completionLogRepository = new CompletionLogRepository(db);
  const capsuleRepository = new CapsuleRepository(db);

  const {
    atLeastOneCapsuleExists,
    dailyCompletionLogs,
    averageCompletionRate,
  } = useCompletionLogs({
    capsuleRepository,
    completionLogRepository,
  });

  const { stagingCompletionLogs, toggleCompletion } = useCompleteCompletionLogs(
    {
      completionLogRepository,
      dailyCompletionLogs,
    },
  );

  const insets = useSafeAreaInsets();
  const insetsViewStyle: ViewStyle = {
    paddingTop: insets.top + SCREEN_HEIGHT * 0.05,
    paddingBottom: insets.bottom + SCREEN_HEIGHT * 0.05,
  };
  return (
    <LinearGradientBackground
      colors={LINEAR_GRADIENT_2}
      start={{ x: 0.6, y: 0.3 }}
      end={{ x: 1, y: 1 }}
    >
      {!atLeastOneCapsuleExists ? (
        <View
          style={{
            ...styles.sharedContainer,
            ...styles.noCapsuleContainer,
            ...insetsViewStyle,
          }}
        >
          <CreateCapsuleNav atLeastOneCapsuleExists={false} />
        </View>
      ) : (
        <View
          style={{
            ...styles.sharedContainer,
            ...styles.container,
            ...insetsViewStyle,
          }}
        >
          <Text style={[styles.phrase, FONT_STYLES.H1_STYLE]}>
            {PROGRESS_BUDDY_PHRASE}
          </Text>

          <View style={{ flex: 10 }}>
            <TaskList
              stagingCompletionLogs={stagingCompletionLogs}
              toggleCompletion={toggleCompletion}
              averageCompletionRate={averageCompletionRate}
            />
          </View>

          <Button
            icon="happy-outline"
            style={{ width: SCREEN_WIDTH * 0.45 }}
            label="Click here for more!"
            onPress={() => router.push("/(tabs)")}
          />
        </View>
      )}
    </LinearGradientBackground>
  );
};

interface TaskListProps {
  stagingCompletionLogs: CompletionLogWithImage[];
  averageCompletionRate: number;
  toggleCompletion: (completionLogId: string) => void;
}
const TaskList = ({
  stagingCompletionLogs,
  averageCompletionRate,
  toggleCompletion,
}: TaskListProps) => {
  return (
    <HorizontalSwiper
      style={styles.habitCardsScrollView}
      pages={[
        {
          key: "mascot",
          component: (
            <MascotDisplay averageCompletionRate={averageCompletionRate} />
          ),
        },
        {
          key: "todo-list",
          component: (
            <View>
              {!stagingCompletionLogs || stagingCompletionLogs.length === 0 ? (
                <CreateCapsuleNav atLeastOneCapsuleExists={true} />
              ) : (
                <FlatList
                  data={stagingCompletionLogs}
                  style={{ height: HABIT_CARD_HEIGHT, borderRadius: 12 }}
                  contentContainerStyle={{ gap: GAP_BETWEEN_HABIT_CARDS }}
                  nestedScrollEnabled
                  snapToInterval={FLATLIST_SNAP_INTERVAL} // Distance between snapping stops
                  snapToAlignment="center" // Aligns snapped item to "start", "center", or "end"
                  decelerationRate="fast"
                  renderItem={(listRenderItem) => (
                    <HabitCard
                      key={listRenderItem.item.id}
                      completionLog={listRenderItem.item}
                      onCompletion={toggleCompletion}
                    />
                  )}
                  keyExtractor={(completionLog: CompletionLogWithImage) =>
                    completionLog.id
                  }
                />
              )}
            </View>
          ),
        },
      ]}
    />
  );
};
const styles = StyleSheet.create({
  sharedContainer: {
    flex: 1,
    alignItems: "center",

    flexDirection: "column",

    height: SCREEN_HEIGHT,
  },
  noCapsuleContainer: {
    justifyContent: "center",
  },
  container: {
    justifyContent: "space-between",
  },
  phrase: {
    color: COLOR_PRIMARY,
    textAlign: "center",
    flex: 1, // Allows phrase to take up space
  },

  habitCardsScrollView: {
    width: SCREEN_WIDTH * 0.8,
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
