import { LinearGradientBackground } from "@/components/linear-gradient-bg";
import { COLOR_PRIMARY, LINEAR_GRADIENT_2 } from "@/constants/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import {
  PROGRESS_BUDDY_HINT,
  PROGRESS_BUDDY_PHRASE,
} from "@/constants/per-screen/index/constants";
import FONT_STYLES from "@/constants/text";

import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export const ProgressBuddy = () => {
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
        <Image
          source={require("../../../assets/images/mascot.png")}
          style={styles.mascot}
        />

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
  },
  mascot: {
    flex: 1,
    width: SCREEN_WIDTH * 0.6,
    resizeMode: "contain",
  },
  hint: {
    color: COLOR_PRIMARY,
    opacity: 0.6,
  },
});
