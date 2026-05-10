import { AppDrawer } from "@/app/create-capsule/app-drawer/app-drawer";
import ImagePickerWrapper from "@/components/image-picker-wrapper";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import { selectSelectedPackageName } from "@/redux/app-list-slice";
import {
  createCapsule,
  initDatabase,
} from "@/utils/expo/sqlite/capsules-repository";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

const CreateCapsuleForm: React.FC = () => {
  const ref = useRef<BottomSheet>(null);
  const [badHabitName, setBadHabitName] = useState<string | null>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<any>(false);
  const selectedPackageName = useSelector(selectSelectedPackageName);

  const handleCreate = async () => {
    const db = await initDatabase();
    if (!badHabitName || !imageUrl || !selectedPackageName) return;
    await createCapsule(
      {
        badHabitName,
        imageUrl,
        appPackageName: selectedPackageName,
      },
      db,
    );
  };

  useEffect(() => {
    console.log("Selected package changed:", selectedPackageName);
  }, [selectedPackageName]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Bad Habit Name *</Text>
          <TextInput
            value={badHabitName ?? ""}
            onChangeText={(text) => {
              setBadHabitName(text);
            }}
            placeholder="e.g., Ditch Social Media"
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Application You Want to Ditch *</Text>
          {selectedPackageName && (
            <Text style={styles.label}>{selectedPackageName}</Text>
          )}
          <Button
            label={"Select an application"}
            onPress={() => {
              ref.current?.expand();
            }}
          />
        </View>
        <ImagePickerWrapper image={imageUrl} setImage={setImageUrl} />
        <Button
          label={isEditMode ? "Save Changes" : "Create Capsule"}
          onPress={handleCreate}
        />
      </ScrollView>
      <AppDrawer ref={ref} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    // flexGrow: 1,
    padding: 16,
    width: SCREEN_WIDTH * 0.9,
    gap: SCREEN_HEIGHT * 0.01,
  },
  inputSection: {
    gap: 8,
  },
  label: {
    color: "#707070",
    fontFamily: "sans-serif",
    fontWeight: "bold",
  },
  textInput: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#707070",
    borderRadius: 8,
    fontFamily: "sans-serif",
    fontSize: 16,
    transitionProperty: "border-color, outline-offset",
    transitionDuration: "200ms",
    outlineOffset: 0,
    outlineColor: "transparent",
    // focus: {
    //   borderWidth: 2,
    //   borderColor: "#3498db",
    //   outlineOffset: -2,
    //   outlineColor: "#3498db",
    //   outlineStyle: "solid",
    //   outlineWidth: 2,
    // },
  },
  button: {
    width: "100%",
    justifyContent: "space-between",
    textTransform: "none",
  },
  removeMediaButton: {
    position: "absolute",
    top: -32,
    right: -48,
    zIndex: 1,
  },
  mediaPreview: {
    width: "100%",
    maxHeight: 64,
    objectFit: "contain",
  },
  mediaInfo: {
    padding: 12,
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 16,
    // truncate: true,
  },
  smallText: {
    fontSize: 12,
    color: "#a0aec0",
  },
  uploadContainer: {
    flexDirection: "column",
  },
  bottomButton: {
    width: "100%",
    borderRadius: 24,
    textTransform: "none",
    fontSize: 18,
  },
});

export default CreateCapsuleForm;
