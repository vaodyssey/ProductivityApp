import { AppDrawer } from "@/components/app-drawer/app-drawer";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import { selectSelectedPackageName } from "@/redux/app-list-slice";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

interface CreateCapsuleFormProps {
  habitName: string;
  setHabitName: (value: string) => void;
  selectedApp: string | null;
  setSelectedApp: (app: string | null) => void;
  availableApps: any[];
  handleAppSelect: (app: string) => void;
}

const CreateCapsuleForm: React.FC = (
  {
    //   habitName,
    //   setHabitName,
    //   selectedApp,
    //   setSelectedApp,
    //   availableApps,
    //   handleAppSelect,
  },
) => {
  // const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const ref = useRef<BottomSheetModal>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState<any>(false);
  const selectedPackageName = useSelector(selectSelectedPackageName);

  const handleCreate = () => {
    // Logic to create or save changes
  };

  const handleRemoveMedia = () => {
    setMediaPreview(null);
    setMediaFile(null);
  };

  useEffect(() => {
    console.log("Selected package changed:", selectedPackageName);
  }, [selectedPackageName]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Bad Habit Name */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Bad Habit Name *</Text>
          <TextInput
            value={""}
            onChangeText={() => {}}
            placeholder="e.g., Ditch Social Media"
            style={styles.textInput}
          />
        </View>

        {/* Application Selection */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Application You Want to Ditch *</Text>
          {selectedPackageName && (
            <Text style={styles.label}>{selectedPackageName}</Text>
          )}
          <Button
            label={"Select an application"}
            onPress={() => {
              ref.current?.present();
            }}
          />
        </View>

        {/* Media Upload */}
        {/* {mediaPreview ? (
          <Card className="relative overflow-hidden">
            <Button label="Remove" onPress={handleRemoveMedia} />
            {mediaFile?.type.startsWith("video/") ? (
              <Video
                source={{ uri: mediaPreview }}
                controls
                style={styles.mediaPreview}
              />
            ) : (
              <Image
                source={{ uri: mediaPreview }}
                style={styles.mediaPreview}
              />
            )}
            <View style={styles.mediaInfo}>
              <Text style={styles.text}>{mediaFile?.name}</Text>
              <Text style={styles.smallText}>
                {(mediaFile?.size! / (1024 * 1024)).toFixed(2)} MB
              </Text>
            </View>
          </Card>
        ) : ( */}
        <TouchableOpacity onPress={() => ref.current?.present()}>
          <View style={styles.uploadContainer}>
            {/* <Upload /> */}
            <Button
              label="Tap to upload media"
              onPress={() => ref.current?.present()}
            />
          </View>
        </TouchableOpacity>
        {/* )} */}

        {/* Bottom Create Button */}
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
