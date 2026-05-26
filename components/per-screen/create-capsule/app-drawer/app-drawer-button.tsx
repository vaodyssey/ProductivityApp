import { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { BaseProps } from "./types";

interface AppDrawerButton extends BaseProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (value: boolean) => void;
}
export const AppDrawerButton = ({
  isDrawerOpen,
  setIsDrawerOpen,
}: AppDrawerButton) => {
  useEffect(() => {}, []);

  const toggleDrawerVisibility = () => {
    if (!isDrawerOpen) setIsDrawerOpen(true);
    else setIsDrawerOpen(false);
  };
  return (
    <TouchableOpacity onPress={toggleDrawerVisibility}>
      <Text>Open Drawer</Text>
    </TouchableOpacity>
  );
};
