import { COLOR_BLACK_1 } from "@/constants/colors";
import { Text, TouchableOpacity, View } from "react-native";
import { AppItem } from "./types";

interface AppGridItemProps {
  appItem: AppItem;
  onToggle: (appPackageName: string) => void;
}

export const AppGridItem: React.FC<AppGridItemProps> = ({
  appItem,
  onToggle,
}) => {
  return (
    <TouchableOpacity onPress={() => onToggle(appItem.packageName)}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: COLOR_BLACK_1 }}>{appItem.appName}</Text>
        {/* <Checkbox checked={isChecked} onPress={onToggle} /> */}
      </View>
    </TouchableOpacity>
  );
};
