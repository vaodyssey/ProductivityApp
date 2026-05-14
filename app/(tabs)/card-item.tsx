import { COLOR_PRIMARY } from "@/constants/colors";
import { SCREEN_WIDTH } from "@/constants/dimensions";
import FONT_STYLES from "@/constants/text";
import { Capsule } from "@/models/Capsule";
import { deleteCapsule } from "@/utils/expo/sqlite/capsules-repository";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardItemProps {
  capsule: Capsule;
  onPressDelete?: () => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  capsule,
  onPressDelete,
}) => {
  const router = useRouter();
  const handleDelete = async (id: number | undefined) => {
    try {
      if (!id) return;

      if (typeof window !== "undefined") {
        console.log(`Deleting capsule with ID: ${id}`);
      }

      await deleteCapsule(id);
      onPressDelete && onPressDelete();
    } catch (error) {
      console.error("Failed to delete capsule:", error);
    }
  };

  const updateCapsule = (id: number | undefined) => {
    router.navigate({ pathname: "/create-capsule", params: { id } });
  };

  return (
    <View style={styles.container}>
      <View onTouchStart={() => updateCapsule(capsule.id)}>
        <Text style={[styles.badHabitName, FONT_STYLES.H4_STYLE]}>
          {capsule.badHabitName || "No Habit Name"}
        </Text>
        <Text
          style={[styles.packageName, FONT_STYLES.CAPTION_STYLE]}
          numberOfLines={1} // Prevents text from breaking layout
          ellipsizeMode="tail" // Adds "..." if too long
        >
          {capsule.appPackageName}
        </Text>
      </View>

      {/* Right Side: Delete Button */}
      <TouchableOpacity
        onPress={() => handleDelete(capsule.id)}
        style={styles.deleteButton}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Optional separator line
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.1,
  },
  packageName: {
    color: COLOR_PRIMARY,
    flex: 1, // Allows text to take available space before hitting the button
  },
  deleteButton: {
    padding: 4,
    paddingRight: 8,
  },
  deleteButtonText: {
    color: "#FF5252", // Red for delete
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 18, // Matches font size for proper hit area
  },
  badHabitName: {
    color: COLOR_PRIMARY,
  },
});
