import { COLOR_BLACK_1 } from "@/constants/colors";
import { DRAWER_COLUMNS_COUNT } from "@/constants/dimensions";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppItem } from "./types";

interface AppGridItemProps {
  appItem: AppItem;
  onToggle: (appPackageName: string) => void;
}

export const AppGridItem: React.FC<AppGridItemProps> = ({
  appItem,
  onToggle,
}) => {
  const styles = StyleSheet.create({
    itemWrapper: {
      width: `${100 / DRAWER_COLUMNS_COUNT}%`, // This ensures exactly 4 per row
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10, // Adds some breathing room between rows
      backgroundColor: "#eee",
      height: SCREEN_HEIGHT * 0.5,
    },
  });
  return (
    <TouchableOpacity
      onPress={() => onToggle(appItem.packageName)}
      style={styles.itemWrapper}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: COLOR_BLACK_1 }}>{appItem.packageName}</Text>
        {/* <Checkbox checked={isChecked} onPress={onToggle} /> */}
      </View>
    </TouchableOpacity>
  );
};
