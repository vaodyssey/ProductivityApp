// AlertDialog.ts
import { Alert } from "react-native";

interface AlertDialogButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

interface AlertDialogOptions {
  title: string;
  message: string;
  buttons: AlertDialogButton[];
}

export function showAlertDialog({
  title,
  message,
  buttons,
}: AlertDialogOptions): Promise<string> {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      buttons.map((btn) => ({
        ...btn,
        onPress: () => resolve(btn.text),
      })),
    );
  });
}
