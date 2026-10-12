import { LinearGradient, LinearGradientPoint } from "expo-linear-gradient";
import { JSX } from "react";
import { ColorValue, StyleSheet } from "react-native";

interface LinearGradientBackgroundProps {
  children: JSX.Element;
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  start?: LinearGradientPoint;
  end?: LinearGradientPoint;
}

export const LinearGradientBackground = ({
  children,
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}: LinearGradientBackgroundProps) => {
  return (
    <LinearGradient
      // Array of colors for the gradient string/hex/rgba
      colors={colors}
      // Optional: Control the direction (Top-left to Bottom-right)
      start={start}
      end={end}
      style={styles.background}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // Ensures the gradient covers the whole screen
  },
});
