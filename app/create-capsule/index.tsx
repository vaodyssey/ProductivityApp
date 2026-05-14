import { useChangeScreenTitle } from "@/hooks/useChangeScreenTitle";
import { Capsule } from "@/models/Capsule";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { CapsuleFormMode, DEFAULT_CAPSULE } from "./constants";
import CapsuleForm from "./create-capsule-form";
import { useCapsule } from "./hooks/useCapsule";

const CreateCapsuleScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const methods = useForm<Capsule>({ defaultValues: DEFAULT_CAPSULE });
  const mode = id ? CapsuleFormMode.EDIT : CapsuleFormMode.CREATE;
  const shouldChangeScreenTitle = !!id;

  useCapsule({ methods, id });
  useChangeScreenTitle({
    newTitle: "Update Capsule",
    shouldApply: shouldChangeScreenTitle,
  });

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <CapsuleForm mode={mode} />
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
