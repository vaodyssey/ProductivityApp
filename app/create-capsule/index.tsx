import { Capsule } from "@/models/Capsule";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import CreateCapsuleForm from "./create-capsule-form";
import { useCapsule } from "./hooks/useCapsule";

const CreateCapsuleScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const methods = useForm<Capsule>();
  useCapsule(id);
  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <CreateCapsuleForm />
      </View>
    </FormProvider>
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
