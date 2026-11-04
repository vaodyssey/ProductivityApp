import { DAYS_OF_WEEK } from "@/constants/date";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface WeekdayPickerProps {
  selectedDays: number[];
  setSelectedDays: (selectedDays: number[]) => void;
}
export default function WeekdayPicker({
  selectedDays,
  setSelectedDays,
}: WeekdayPickerProps) {
  // Stores selected day IDs (e.g., [1, 2, 3, 4, 5] for weekdays)

  const toggleDay = (id: number) => {
    if (selectedDays.includes(id)) {
      setSelectedDays(selectedDays.filter((dayId) => dayId !== id));
    } else {
      setSelectedDays([...selectedDays, id].sort());
    }
  };

  return (
    <View style={styles.container}>
      {DAYS_OF_WEEK.map((day) => {
        const isSelected = selectedDays.includes(day.id);
        return (
          <TouchableOpacity
            key={day.id}
            style={[styles.circle, isSelected && styles.circleSelected]}
            onPress={() => toggleDay(day.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {day.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  circleSelected: {
    backgroundColor: "#007AFF", // Active color
  },
  label: {
    color: "#333",
    fontWeight: "600",
  },
  labelSelected: {
    color: "#fff",
  },
});
