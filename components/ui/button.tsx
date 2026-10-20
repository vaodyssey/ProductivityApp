import { COLOR_PRIMARY, COLOR_RED, COLOR_WHITE } from "@/constants/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import FONT_STYLES from "@/constants/text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

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
  icon?: string;
  style?: ViewStyle;
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
  iconAndTextWrapper: {
    flexDirection: "row",
    gap: SCREEN_WIDTH * 0.02,
    alignItems: "center",
    justifyContent: "center",
  },
});

const Spinner = () => <Text style={styles.spinner}>...</Text>;

export default function Button(props: ButtonProps) {
  const {
    label,
    variant = ButtonVariants.PRIMARY,
    icon,
    style,
    isLoading,
    onPress,
  } = props;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === ButtonVariants.PRIMARY
          ? styles.primaryButton
          : styles.dangerButton,
        style && { ...style },
      ]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <View style={styles.iconAndTextWrapper}>
          {/* workaround to bypass the humongous Ionicons type */}
          {icon && (
            <Ionicons
              name={icon as any}
              size={SCREEN_HEIGHT * 0.02}
              color={COLOR_WHITE}
            />
          )}
          <Text
            style={{
              ...FONT_STYLES.LABEL_STYLE,
              color: COLOR_WHITE,
              textAlign: "center",
            }}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
