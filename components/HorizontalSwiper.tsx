import { SCREEN_WIDTH } from "@/constants/dimensions";
import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

type Page = { key: string; component: React.ReactNode };

export default function HorizontalSwiper({
  pages,
  style,
}: {
  pages: Page[];
  style: ViewStyle;
}) {
  const width = (style as ViewStyle).width;
  return (
    <ScrollView
      horizontal
      nestedScrollEnabled={true}
      style={style ?? styles.defaultContainerStyle}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
      snapToInterval={SCREEN_WIDTH * 0.8} // 👈 Tells ScrollView where to stop
      snapToAlignment="center"
      decelerationRate="fast"
    >
      {pages.map((page) => (
        <View key={page.key} style={{ width: SCREEN_WIDTH * 0.8 }}>
          {page.component}
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  defaultContainerStyle: {
    flex: 1,
    width: SCREEN_WIDTH * 0.8,
    // height: SCREEN_HEIGHT * 0.8,
    // paddingHorizontal: SCREEN_WIDTH * 0.06,
    // paddingVertical: SCREEN_HEIGHT * 0.2,
    // gap: SCREEN_WIDTH * 0.2,
  },
  contentContainer: {
    // justifyContent: "center",
    alignItems: "center",
    // flex: 1,
    // height: SCREEN_WIDTH * 0.8,
    // width: SCREEN_WIDTH * 0.5,
  },
});
