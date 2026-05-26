import { COLOR_PRIMARY, COLOR_RED } from "@/constants/colors";
import { SCREEN_WIDTH } from "@/constants/dimensions";
import FONT_STYLES from "@/constants/text";
import { Capsule } from "@/models/Capsule";
import { deleteCapsule } from "@/utils/expo/sqlite/capsules-repository";
import { Ionicons } from "@expo/vector-icons";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardItemProps {
  capsule: Capsule;
  onPressDelete?: () => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  capsule,
  onPressDelete,
}) => {
  const router = useRouter();
  const handleDeleteConfirmation = (id?: number) => {
    if (!id) return;
    Alert.alert(
      "Delete Capsule",
      "Are you sure you want to delete this capsule?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(id),
        },
      ],
    );
  };
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
        onPress={() => handleDeleteConfirmation(capsule.id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="trash-outline"
          size={SCREEN_WIDTH * 0.05}
          color={COLOR_RED}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SCREEN_HEIGHT * 0.01,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    borderWidth: SCREEN_HEIGHT * 0.003,
    borderColor: COLOR_PRIMARY,
    borderRadius: SCREEN_WIDTH * 0.05,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.1,
  },
  packageName: {
    color: COLOR_PRIMARY,
    flex: 1, // Allows text to take available space before hitting the button
  },
  badHabitName: {
    color: COLOR_PRIMARY,
  },
});
