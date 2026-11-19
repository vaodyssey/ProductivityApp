import Button from "@/components/ui/button";
import FONT_STYLES from "@/constants/text";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

interface CreateCapsuleNavProps {
  atLeastOneCapsuleExists: boolean;
}
export const CreateCapsuleNav = ({
  atLeastOneCapsuleExists,
}: CreateCapsuleNavProps) => {
  const message = atLeastOneCapsuleExists
    ? "You've completed all of today's task! Want to grow more?"
    : "Welcome! Let's get started!";
  return (
    <View style={styles.container}>
      <Text style={{ ...FONT_STYLES.H3_STYLE, textAlign: "center" }}>
        {message}
      </Text>
      <Button
        icon="add-circle-outline"
        style={{ width: SCREEN_WIDTH * 0.45 }}
        label="Create Capsule"
        onPress={() => router.navigate("/create-capsule")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: SCREEN_HEIGHT * 0.01,
  },
});
