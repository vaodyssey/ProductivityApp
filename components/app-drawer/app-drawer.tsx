import { COLOR_BLACK_1 } from "@/constants/colors";
import { DRAWER_COLUMNS_COUNT, SCREEN_WIDTH } from "@/constants/dimensions";
import AppListModule from "@/modules/app-list-module";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Spinner from "../ui/spinner";
import { BaseProps } from "./types";

interface AppGridItemProps {
  appName: string;
  isChecked: boolean;
  onToggle: () => void;
}

const AppGridItem: React.FC<AppGridItemProps> = ({
  appName,
  isChecked,
  onToggle,
}) => {
  return (
    <TouchableOpacity onPress={onToggle}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: COLOR_BLACK_1 }}>{appName}</Text>
        {/* <Checkbox checked={isChecked} onPress={onToggle} /> */}
      </View>
    </TouchableOpacity>
  );
};

interface AppItem {
  id: string;
  appName: string;
  packageName: string;
  isChecked: boolean;
}

interface AppListProps {
  apps: AppItem[];
  onToggleApp: (id: string) => void;
}

const AppList: React.FC<AppListProps> = ({ apps, onToggleApp }) => {
  const ITEM_WIDTH = SCREEN_WIDTH / DRAWER_COLUMNS_COUNT;
  const styles = StyleSheet.create({
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
    },
    itemWrapper: {
      width: `${100 / DRAWER_COLUMNS_COUNT}%`, // This ensures exactly 4 per row
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10, // Adds some breathing room between rows
    },
  });

  return (
    <View style={styles.gridContainer}>
      {apps.map((app) => (
        <View key={app.id} style={styles.itemWrapper}>
          <AppGridItem
            appName={app.appName}
            isChecked={app.isChecked}
            onToggle={() => onToggleApp(app.id)}
          />
        </View>
      ))}
    </View>
  );
};

interface AppDrawerProps extends BaseProps {
  // onDismiss: () => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({ ref }) => {
  const [apps, setApps] = useState([]);
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const loadApps = async () => {
    const installedApps = await AppListModule.getInstalledApps();
    console.log(installedApps);
    setApps(installedApps);
    setIsLoadingApps(false);
  };
  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
        pressBehavior="close"
      />
    ),
    [],
  );
  useEffect(() => {
    if (!AppListModule) return;
    loadApps();
  }, [AppListModule]);

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={renderBackdrop}
      index={0}
      snapPoints={["50%"]}
    >
      <BottomSheetView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Select Apps</Text>
        {isLoadingApps ? (
          <Spinner />
        ) : (
          <AppList apps={apps} onToggleApp={(id) => {}} />
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};
