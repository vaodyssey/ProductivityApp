import Divider from "@/components/ui/divider";
import Spinner from "@/components/ui/spinner";
import { DRAWER_COLUMNS_COUNT, SCREEN_WIDTH } from "@/constants/dimensions";
import { Capsule } from "@/models/Capsule";
import AppListModule from "@/modules/app-list-module";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  SCREEN_HEIGHT,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ListRenderItemInfo, StyleSheet, Text } from "react-native";
import { BOTTOM_SHEET_SNAP_POINTS } from "../constants";
import { AppGridItem } from "./app-grid-item";
import { AppSearchBar } from "./app-search-bar";
import { AppItem, BaseProps } from "./types";

interface AppListProps {
  apps: AppItem[];
}

const AppList: React.FC<AppListProps> = ({ apps }) => {
  const methods = useFormContext<Capsule>();
  const onToggle = (packageName: string) =>
    methods.setValue("appPackageName", packageName);

  return (
    <BottomSheetFlatList
      data={apps}
      renderItem={(appItem: ListRenderItemInfo<AppItem>) => (
        <AppGridItem appItem={appItem.item} onToggle={onToggle} />
      )}
    />
  );
};

interface AppDrawerProps extends BaseProps {
  // onDismiss: () => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({ ref }) => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const BOTTOM_SHEET_CLOSE_POSITION = -1;
  const BOTTOM_SHEET_OPEN_POSITION = 0;
  const allAppsRef = useRef<AppItem[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const loadApps = async () => {
    const installedApps = await AppListModule.getInstalledApps();
    console.log(installedApps);
    setApps(installedApps);
    setIsLoadingApps(false);
    allAppsRef.current = installedApps;
  };
  const resetSearch = () => setApps(allAppsRef.current ?? []);
  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={BOTTOM_SHEET_CLOSE_POSITION}
        appearsOnIndex={BOTTOM_SHEET_OPEN_POSITION}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleSheetChange = (index: number) => {
    const isBottomSheetCollapsed = index === BOTTOM_SHEET_CLOSE_POSITION;
    if (isBottomSheetCollapsed || apps.length) return;
    console.log("index: ", index);
    loadApps();
  };
  useEffect(() => {}, []);

  return (
    <BottomSheet
      ref={ref}
      backdropComponent={renderBackdrop}
      index={BOTTOM_SHEET_CLOSE_POSITION}
      snapPoints={BOTTOM_SHEET_SNAP_POINTS}
      enablePanDownToClose={true}
      enableDynamicSizing={false}
      style={styles.bottomSheetContainer}
      onChange={handleSheetChange}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Select Apps</Text>
      <AppSearchBar
        apps={apps}
        onSearchResults={setApps}
        resetSearch={resetSearch}
      />
      <Divider />
      {isLoadingApps ? <Spinner /> : <AppList apps={apps} />}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flexDirection: "column",
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.01,
    width: "100%",
  },
  itemWrapper: {
    width: `${100 / DRAWER_COLUMNS_COUNT}%`, // This ensures exactly 4 per row
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10, // Adds some breathing room between rows
  },
});
