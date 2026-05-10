import React from "react";
import { StyleSheet, View } from "react-native";
import CreateCapsuleForm from "./create-capsule-form";

const CreateCapsuleScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <CreateCapsuleForm />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateCapsuleScreen;
