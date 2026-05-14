import { COLOR_BLACK_1 } from "@/constants/colors";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import myImage from "../../../assets/images/favicon.png";
import { AppItem } from "./types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface AppGridItemProps {
  appItem: AppItem;
  onToggle: (appPackageName: string) => void;
}

export const AppGridItem: React.FC<AppGridItemProps> = ({
  appItem,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onToggle(appItem.packageName)}
      style={styles.itemWrapper}
    >
      {/* Column 1 - App name & package name (11/12 width) */}
      <View style={styles.infoColumn}>
        <Text style={styles.appName}>{appItem.appName}</Text>
        <Text style={styles.packageName}>{appItem.packageName}</Text>
      </View>

      {/* Column 2 - App icon (1/12 width) */}
      <View style={styles.iconColumn}>
        <Image source={myImage} style={styles.icon} />
      </View>
    </TouchableOpacity>
  );
};

const ICON_SIZE = SCREEN_WIDTH * 0.08;

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#eee",
    marginVertical: 6,
    borderRadius: SCREEN_WIDTH * 0.1,
  },
  infoColumn: {
    flex: 11,
    flexDirection: "column",
    justifyContent: "center",
  },
  appName: {
    color: COLOR_BLACK_1,
    fontWeight: "600",
    fontSize: 14,
  },
  packageName: {
    color: COLOR_BLACK_1,
    fontSize: 12,
    opacity: 0.6,
  },
  iconColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
  },
});
