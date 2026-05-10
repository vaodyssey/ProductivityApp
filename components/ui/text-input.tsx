// import React from "react";
import {
    Platform,
    TextInput as RNTextInput,
    StyleSheet,
    Text,
    TextInputProps,
    View,
} from "react-native";

interface TextInputExtendedProps extends TextInputProps {
  label?: string;
  error?: string;
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
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[styles.input, props.style]}
        editable={!props.editable}
        {...props}
      />
      {props.error && <Text style={styles.errorText}>{props.error}</Text>}
    </View>
  );
}
