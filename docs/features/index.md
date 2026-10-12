# Home Page

## Structure

- Contains 2 components: the Progress Buddy and the My Top Habits.
  - Both should be located within `constants\per-screen\index` folder.
- On Scroll, a smooth "scroll-based cross-fade" mechanism is used to gradually hide The Progress buddy, and reveal the Top Performed habits.

## Progress Buddy

- A full screen component with the following structure:
  - A H3 level short phrase at the top, not more than 5 words (e.g. [You Rock!, You've got this sweetie!]). Stick to the top of the component.
  - A mascot in the middle of the screen, right underneath the short phrase. Takes up the rest of the screen in the middle, and defaults to happy Hard-coded image for now at `assets\images\mascot.png`.
  - A hint text "Scroll for More" at the bottom. Stick to the bottom of the component.
- Background color: `COLOR_LIGHT_BLUE` at `constants\colors.ts`. Will upgrade to gradient color in the future.

## My Top Habits

- Contains 2 sections - top 3 most performed habits , and the remaining 2.

- Top 3 habits are measured by **number of completions per week**. For example:
  - User wants to (A) "Read Atomic Habits" for 5 times per week; (B) "Go Jogging" for 3 times per week
  - After week completes, if user completes 2 out of 5 times for (A), 3 out of 5 times for (B), then Rank B above A, or else A above B.
  - In case they have equal number of completions, then sort the habits alphabetically.

### Top 3 habits: Contains 3 items as follows

- A circle with number 1 at the top.
- Underneath is a box that has 2 top rounded edges (`borderTopleftRadius` + `borderTopRightRadius`)
- Background color for the box should be `COLOR_WHITE`.
- The box has the habit name at the top (`H4_STYLE`), and number of times completed this week (`H3_STYLE`)

### The remaining 2: A list of item, each look as follows:

- Has a circle on the leftmost side, containing the avatar image (use `assets\images\favicon.png`) for now
- Has the habit name right next to avatar image, and finally, the number of times completed this week on the rightmost of the item. Use `components\per-screen\capsules\card-item.tsx` for reference.

## Scrolling logic

- The logic should reside in `app\(tabs)\index.tsx`
- The Hero section should have My Top Habits scrolling over it, and have the initial height of the phone's `SCREEN_HEIGHT`.
- Use this as the reference for the scroll-based cross-fade.

```tsx
import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

export default function ScrollFadeScreen() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Hero fades out as user scrolls
  const heroAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, 300], // Fade happens between y=0 and y=300
      [1, 0], // Opacity goes from 1 to 0
      Extrapolate.CLAMP,
    ),
  }));

  // List fades in as user scrolls
  const listAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 300], [0, 1], Extrapolate.CLAMP),
  }));

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      style={styles.container}
    >
      {/* Hero Section */}
      <Animated.View style={[styles.hero, heroAnimStyle]}>
        <View
          style={{
            backgroundColor: "#FF6B6B",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Your mascot/gradient goes here */}
        </View>
      </Animated.View>

      {/* Content List */}
      <Animated.View style={[styles.listContainer, listAnimStyle]}>
        <FlatList
          scrollEnabled={false}
          data={Array.from({ length: 10 }, (_, i) => ({ id: i }))}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.placeholder} />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </Animated.View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    height: 600,
    width: "100%",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  listItem: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  placeholder: {
    height: 60,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});
```

## AGENTIC AI ONLY

- Comment existing VPN + password buttons, as I will figure out where to put them later on.
- Temporarily add `completedThisWeek` attribute to `Capsule.ts`, but don't apply that to the database yet.
- Mock data for Capsules should be in `constants/per-screen/index/constants.ts`. Will be removed later when testing is done.
