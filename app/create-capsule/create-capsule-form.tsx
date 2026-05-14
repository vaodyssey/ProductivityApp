import { AppDrawer } from "@/app/create-capsule/app-drawer/app-drawer";
import ImagePickerWrapper from "@/components/image-picker-wrapper";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import FONT_STYLES from "@/constants/text";
import { Capsule } from "@/models/Capsule";
import {
  createCapsule,
  initDatabase,
} from "@/utils/expo/sqlite/capsules-repository";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { FieldErrors, useFormContext } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { CapsuleFormMode } from "./constants";

interface CapsuleFormProps {
  mode: CapsuleFormMode;
}
const CapsuleForm: React.FC<CapsuleFormProps> = ({ mode }) => {
  const ref = useRef<BottomSheet>(null);
  const { getValues, handleSubmit, watch } = useFormContext<Capsule>();
  const defaultImage = watch("imageUrl");
  const onSubmit = async () => {
    const db = await initDatabase();
    const capsule = getValues();
    await createCapsule(capsule, db);
  };
  const onSubmitError = (errors: FieldErrors<Capsule>) => console.log(errors);

  return (
    <View style={styles.content}>
      <View style={styles.formGroup}>
        <View style={styles.formItem}>
          <Text style={FONT_STYLES.H5_STYLE}>Bad Habit Name *</Text>
          <TextInput
            placeholder="e.g. Ditch Social Media"
            name={"badHabitName"}
          />
        </View>

        <View style={styles.formItem}>
          <Text style={FONT_STYLES.H5_STYLE}>
            Application You Want to Ditch *
          </Text>
          <TextInput
            onTextInputPress={() => {
              ref.current?.expand();
            }}
            editable={false}
            placeholder="e.g. Facebook"
            name={"appPackageName"}
          />
        </View>
        <View style={styles.formItem}>
          <Text style={FONT_STYLES.H5_STYLE}>Select your worst image *</Text>
          <ImagePickerWrapper
            // setImage={(image) => setValue("imageUrl", image)}
            imageHookFormPath={"imageUrl"}
          />
        </View>
      </View>
      <View style={styles.createCapsuleButton}>
        <Button
          label={
            mode === CapsuleFormMode.EDIT ? "Save Changes" : "Create Capsule"
          }
          onPress={handleSubmit(onSubmit, onSubmitError)}
        />
      </View>
      <AppDrawer ref={ref} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: SCREEN_WIDTH * 0.1,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    width: "100%",
  },
  formGroup: {
    flex: 11,
    gap: SCREEN_HEIGHT * 0.05,
  },
  formItem: {
    gap: SCREEN_HEIGHT * 0.01,
  },
  createCapsuleButton: {
    flex: 1,
    bottom: SCREEN_HEIGHT * 0.01,
  },
});

export default CapsuleForm;
