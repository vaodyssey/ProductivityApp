import ImagePickerWrapper from "@/components/image-picker-wrapper";
import { AppDrawer } from "@/components/per-screen/create-capsule/app-drawer/app-drawer";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import WeekdayPicker from "@/components/weekday-picker";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import { CapsuleFormMode } from "@/constants/per-screen/create-capsule/constants";
import { HOME_ROUTE } from "@/constants/routes";
import FONT_STYLES from "@/constants/text";
import { Capsule } from "@/models/capsule";
import CapsuleRepository from "@/repository/capsule-repository";
import CompletionLogRepository from "@/repository/completion-log-repository";
import { createCapsule } from "@/services/capsule-service";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useRef, useState } from "react";
import { FieldErrors, useFormContext } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

interface CapsuleFormProps {
  mode: CapsuleFormMode;
}
const CapsuleForm: React.FC<CapsuleFormProps> = ({ mode }) => {
  const ref = useRef<BottomSheet>(null);
  const { getValues, handleSubmit } = useFormContext<Capsule>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const db = useSQLiteContext();
  const capsuleRepository = new CapsuleRepository(db);
  const completionLogRepository = new CompletionLogRepository(db);
  const router = useRouter();
  const onSubmit = async () => {
    try {
      console.log("seected days: ", selectedDays);
      setIsSubmitting(true);
      const capsule = getValues();
      await createCapsule({
        capsuleRepository,
        completionLogRepository,
        capsule,
        selectedDays,
      });

      router.navigate(HOME_ROUTE);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const onSubmitError = (errors: FieldErrors<Capsule>) => console.log(errors);

  return (
    <View style={styles.content}>
      <View style={styles.formGroup}>
        <View style={styles.formItem}>
          <Text style={FONT_STYLES.H5_STYLE}>Good Habit Name *</Text>
          <TextInput
            placeholder="e.g. Learn a language"
            name={"goodHabitName"}
          />
        </View>

        <View style={styles.formItem}>
          <Text style={FONT_STYLES.H5_STYLE}>Accountable Application *</Text>
          <TextInput
            onTextInputPress={() => {
              ref.current?.expand();
            }}
            editable={false}
            placeholder="e.g. Facebook"
            name={"badAppPackageName"}
          />
        </View>
        <View style={styles.formItem}>
          <Text style={FONT_STYLES.H5_STYLE}>Select your worst image *</Text>
          <ImagePickerWrapper
            // setImage={(image) => setValue("imageUrl", image)}
            imageHookFormPath={"goodImageUrl"}
          />
        </View>
        <View style={styles.formItem}>
          <WeekdayPicker
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
          />
        </View>
      </View>

      <View style={styles.createCapsuleButton}>
        <Button
          label={
            mode === CapsuleFormMode.EDIT ? "Save Changes" : "Create Capsule"
          }
          onPress={handleSubmit(onSubmit, onSubmitError)}
          isLoading={isSubmitting}
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
