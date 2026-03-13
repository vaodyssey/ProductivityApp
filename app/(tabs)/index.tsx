import Button, { ButtonVariants } from "@/components/ui/button";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import FONT_STYLES from "@/constants/text";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const IndexScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={{ ...FONT_STYLES.BODY_STYLE, textAlign: "center" }}>
        You don't have any Capsule of Shame for now. Click Create to get
        started!
      </Text>

      <Button
        label="Create"
        variant={ButtonVariants.PRIMARY}
        onPress={() => {
          router.navigate("/create-capsule"); // Navigate back to the home screen
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SCREEN_HEIGHT * 0.02,
    padding: SCREEN_WIDTH * 0.2,
  },
});

export default IndexScreen;
