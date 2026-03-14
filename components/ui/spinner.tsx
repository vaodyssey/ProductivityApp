import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

// Assuming you have your constant imported, or use a default hex
const COLOR_PRIMARY = "#3498db";

type SpinnerProps = {
  size?: number;
  color?: string;
};

export default function Spinner({
  size = 40,
  color = COLOR_PRIMARY,
}: SpinnerProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // This creates the infinite spinning loop
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true, // This offloads the animation to the UI thread (60fps)
      }),
    ).start();
  }, [rotateAnim]);

  // Map 0 -> 1 to 0deg -> 360deg
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2, // Keeps it a perfect circle
          borderWidth: size / 10, // Proportional border thickness
          borderColor: color,
          borderTopColor: "transparent", // The gap that creates the "spinner" effect
          transform: [{ rotate: spin }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
