import { COLOR_PRIMARY, COLOR_RED } from "@/constants/colors";
import { SCREEN_WIDTH } from "@/constants/dimensions";
import FONT_STYLES from "@/constants/text";
import { Capsule } from "@/models/capsule";
import { Ionicons } from "@expo/vector-icons";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ConfirmDeletePasswordModal } from "./confirm-delete-password-modal";

interface CardItemProps {
  capsule: Capsule;
  onPressDelete?: () => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  capsule,
  onPressDelete,
}) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
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
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="trash-outline"
          size={SCREEN_WIDTH * 0.05}
          color={COLOR_RED}
        />
      </TouchableOpacity>
      <ConfirmDeletePasswordModal
        capsule={capsule}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onPressDelete={onPressDelete}
      />
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
