import { DRAWER_COLUMNS_COUNT } from "@/constants/dimensions";
import AppListModule from "@/modules/app-list-module";
import { setSelectedPackageName } from "@/redux/app-list-slice";
import { AppDispatch } from "@/redux/store";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import Spinner from "../ui/spinner";
import { AppGridItem } from "./app-grid-item";
import { AppItem, BaseProps } from "./types";

interface AppListProps {
  apps: AppItem[];
}

const AppList: React.FC<AppListProps> = ({ apps }) => {
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
  const dispatch = useDispatch<AppDispatch>();
  const onToggle = (packageName: string) =>
    dispatch(setSelectedPackageName(packageName));

  return (
    <View style={styles.gridContainer}>
      {apps.map((app) => (
        <View key={app.id} style={styles.itemWrapper}>
          <AppGridItem appItem={app} onToggle={onToggle} />
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
        {isLoadingApps ? <Spinner /> : <AppList apps={apps} />}
      </BottomSheetView>
    </BottomSheetModal>
  );
};
