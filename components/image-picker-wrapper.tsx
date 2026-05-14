import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Alert, Image, StyleSheet, View } from "react-native";
import Button from "./ui/button";

interface ImagePickerWrapperProps {
  // defaultImage?: string;
  imageHookFormPath: string;
  // setImage: (image: string) => void;
}

export default function ImagePickerWrapper({
  // defaultImage,
  // setImage,
  imageHookFormPath,
}: ImagePickerWrapperProps) {
  const [internalImage, setInternalImage] = useState<string | null>(null);
  const { watch, setValue } = useFormContext();
  const image: string = watch(imageHookFormPath);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setValue(imageHookFormPath, result.assets[0].uri);
      setInternalImage(result.assets[0].uri);
    }
  };
  const buttonLabel = internalImage
    ? "Choose another Image"
    : "Choose an Image";

  // const displayImage = defaultImage ?? internalImage ?? "";
  return (
    <View style={styles.container}>
      <Image source={{ uri: image ?? "" }} style={styles.image} />
      <Button label={buttonLabel} onPress={pickImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: SCREEN_WIDTH * 0.05,
  },
  image: {
    width: Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.5,
    height: Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.3,
    borderRadius: SCREEN_WIDTH * 0.03,
  },
});
