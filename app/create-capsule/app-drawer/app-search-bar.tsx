import TextInput from "@/components/ui/text-input";
import FONT_STYLES from "@/constants/text";
import Feather from "@expo/vector-icons/Feather";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useDebounce } from "../hooks/useDebounce";
import { AppItem } from "./types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface AppSearchBarProps {
  apps: AppItem[];
  onSearchResults: (filtered: AppItem[]) => void;
  resetSearch: () => void;
}

export const AppSearchBar: React.FC<AppSearchBarProps> = ({
  apps,
  onSearchResults,
  resetSearch,
}) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      resetSearch();
      return;
    }

    const filtered = apps.filter(
      (app) =>
        app.appName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        app.packageName.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );

    onSearchResults(filtered);
  }, [debouncedQuery, apps]);

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, FONT_STYLES.LABEL_STYLE]}
        value={query}
        onChangeText={setQuery}
        placeholder="Enter App name here..."
        clearButtonMode="while-editing"
        leadingIcon={<Feather name="search" size={24} color="black" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_WIDTH * 0.01,
    paddingVertical: SCREEN_HEIGHT * 0.02,
  },
  input: {
    borderRadius: SCREEN_WIDTH * 0.1,
    backgroundColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
