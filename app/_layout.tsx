import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { DATABASE_NAME } from "@/constants/database";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { store } from "@/redux/store";
import { initDatabaseIfApplicable } from "@/repository/init-database";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SQLiteProvider } from "expo-sqlite";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "grey",
    },
    contentContainer: {
      flex: 1,
      padding: 36,
      alignItems: "center",
    },
  });
  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.container}>
            <BottomSheetModalProvider>
              <SQLiteProvider
                databaseName={DATABASE_NAME}
                onInit={initDatabaseIfApplicable}
              >
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="create-capsule/index"
                    options={{ title: "Create Capsule" }}
                  />
                </Stack>
              </SQLiteProvider>
              <StatusBar style="auto" />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}
