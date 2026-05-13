// import React from "react";
import FONT_STYLES from "@/constants/text";
import { Controller, useFormContext } from "react-hook-form";
import {
  Platform,
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TextInputProps,
  TouchableOpacity,
} from "react-native";

interface TextInputExtendedProps extends TextInputProps {
  label?: string;
  error?: string;
  onTextInputPress?: () => void;
  name?: string;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 8,
  },
  labelSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#707070",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#707070",
    borderRadius: 8,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
    fontSize: 16,
    transitionProperty: "border-color, outline-offset",
    transitionDuration: "200ms",
    outlineOffset: 0,
    outlineColor: "transparent",
    // focus: {
    //   borderWidth: 2,
    //   borderColor: "#3498db",
    //   outlineOffset: -2,
    //   outlineColor: "#3498db",
    //   outlineStyle: "solid",
    //   outlineWidth: 2,
    // },
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
    fontWeight: "bold",
  },
});

export default function TextInput({ label, ...props }: TextInputExtendedProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      rules={{ required: true }}
      name={props.name ?? ""}
      render={({ field: { onChange, onBlur, value } }) => (
        <TouchableOpacity
          style={styles.container}
          onPress={props.onTextInputPress && props.onTextInputPress}
        >
          {label && (
            <Text style={[styles.label, FONT_STYLES.LABEL_STYLE]}>{label}</Text>
          )}
          <RNTextInput
            style={[styles.input, props.style]}
            editable={!props.editable}
            value={value || "hehehehe"}
            onBlur={onBlur}
            onChangeText={onChange}
            {...props}
          />
          {props.error && <Text style={styles.errorText}>{props.error}</Text>}
        </TouchableOpacity>
      )}
    />
  );
}
