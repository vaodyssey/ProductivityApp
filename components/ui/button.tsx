import { COLOR_PRIMARY, COLOR_RED, COLOR_WHITE } from "@/constants/colors";
import { SCREEN_WIDTH } from "@/constants/dimensions";
import FONT_STYLES from "@/constants/text";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export enum ButtonVariants {
  PRIMARY,
  DANGER,
}

interface ButtonProps {
  label: string;
  variant?: ButtonVariants;
  isLoading?: boolean;
  onClick?: () => void;
}

const styles = StyleSheet.create({
  button: {
    width: "50%",
    height: "8%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SCREEN_WIDTH * 0.1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  primaryButton: {
    backgroundColor: COLOR_PRIMARY,
  },
  dangerButton: {
    backgroundColor: COLOR_RED,
  },
  spinner: {
    fontSize: 14,
    color: "white",
    borderWidth: 2,
    borderColor: "white",
    borderTopColor: "transparent",
    borderRadius: 50 / 2,
    width: 20,
    height: 20,
    textAlign: "center",
    lineHeight: 20,
    transform: [{ rotate: "360deg" }],
  },
  createText: {
    fontSize: 14,
    color: "white",
  },
});

const Spinner = () => <Text style={styles.spinner}>...</Text>;

export default function Button(props: ButtonProps) {
  const { label, variant = ButtonVariants.PRIMARY, isLoading, onClick } = props;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === ButtonVariants.PRIMARY
          ? styles.primaryButton
          : styles.dangerButton,
      ]}
      onPress={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <Text style={{ ...FONT_STYLES.H3_STYLE, color: COLOR_WHITE }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
