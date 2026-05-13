import { COLOR_PRIMARY, COLOR_RED, COLOR_WHITE } from "@/constants/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import FONT_STYLES from "@/constants/text";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export enum ButtonVariants {
  PRIMARY,
  DANGER,
}

export enum ButtonSizes {
  SMALL,
  MEDIUM,
  LARGE,
}

interface ButtonProps {
  label: string;
  variant?: ButtonVariants;

  isLoading?: boolean;
  onPress?: () => void;
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.06,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SCREEN_WIDTH * 0.1,
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
  const { label, variant = ButtonVariants.PRIMARY, isLoading, onPress } = props;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === ButtonVariants.PRIMARY
          ? styles.primaryButton
          : styles.dangerButton,
      ]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <Text
          style={{
            ...FONT_STYLES.LABEL_STYLE,
            color: COLOR_WHITE,
            textAlign: "center",
          }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
