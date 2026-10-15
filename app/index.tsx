// import { SetPasswordModal } from "@/components/per-screen/index/set-password-modal";
// import { showAlertDialog } from "@/components/ui/alert-dialog";
// import Button, { ButtonVariants } from "@/components/ui/button";
// import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
// import VpnAppBlockerModule from "@/modules/vpn-app-blocker-module/src/VpnAppBlockerModule";
// import { readAllCapsules } from "@/utils/expo/sqlite/capsules-repository";
// import React, { useState } from "react";
// import { StyleSheet, View } from "react-native";

import { MyTopHabits } from "@/components/per-screen/index/my-top-habits";
import { ProgressBuddy } from "@/components/per-screen/index/progress-buddy";
import { SCREEN_HEIGHT } from "@/constants/dimensions";
import { SCROLL_FADE_RANGE } from "@/constants/per-screen/index/constants";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const IndexScreen = () => {
  // const [modalVisible, setModalVisible] = useState<boolean>(false);

  // const revokeVpnPermission = async () => {
  //   const vpnIsStopped = await VpnAppBlockerModule.stopVpn();
  //   if (!vpnIsStopped) return;
  //   const tappedButton = await showAlertDialog({
  //     title: "VPN Connection Stopped",
  //     message:
  //       "You have successfully revoked VPN permission for this application.",
  //     buttons: [{ text: "Okay" }],
  //   });
  // };

  // const askUserPermission = async () => {
  //   const tappedButton = await showAlertDialog({
  //     title: "VPN Permission Required",
  //     message:
  //       "This app needs to set up a local VPN connection to block selected apps from the internet. " +
  //       "Your traffic never leaves your device.",
  //     buttons: [{ text: "Deny", style: "cancel" }, { text: "Allow" }],
  //   });

  //   if (tappedButton !== "Allow") return false;
  //   return true;
  // };

  // const blockApps = async (): Promise<void> => {
  //   const vpnIntent = await VpnAppBlockerModule.checkVpnPermission();
  //   let userAgree = false;
  //   if (vpnIntent) userAgree = await askUserPermission();
  //   else userAgree = true;
  //   if (!userAgree) return;
  //   const isVpnReady = await VpnAppBlockerModule.requestVpnPermission();
  //   if (!isVpnReady) return;
  //   const capsules = await readAllCapsules();
  //   VpnAppBlockerModule.startVpn(capsules);
  // };

  const scrollY = useSharedValue(0);
  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, SCROLL_FADE_RANGE],
      [1, 0],
      Extrapolate.CLAMP,
    ),
  }));

  const listAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, SCROLL_FADE_RANGE],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  const pan = Gesture.Pan()
    .hitSlop({
      top: -SCREEN_HEIGHT * 0.8,
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
      scrollY.value = -event.translationY; // Negative because swipe down = scroll up
    })
    .onEnd((event) => {
      // Snap to nearest section
      const isSwipingUp = event.velocityY < 0 || translateY.value < -50;
      const isSwipingDown = event.velocityY > 0 || translateY.value > 50;
      console.log(`end translateY values: ${translateY.value}`);
      console.log(`end scrollY values: ${scrollY.value}`);
      if (
        // Math.abs(translateY.value) > 50 &&
        isSwipingUp
        // scrollY.value < 300
      ) {
        scrollY.value = 300;
      } else if (
        isSwipingDown
        // -50 < translateY.value &&
        // translateY.value < 0 &&
        // scrollY.value >= 300
      ) {
        scrollY.value = 0;
      } else {
        scrollY.value = scrollY.value > 300 ? 300 : 0;
      }
      translateY.value = 0;
    });
  return (
    <GestureDetector gesture={pan}>
      <View style={styles.container}>
        <Animated.View style={[styles.hero, heroAnimStyle]}>
          <ProgressBuddy />
        </Animated.View>

        <Animated.View style={[styles.listContainer, listAnimStyle]}>
          <MyTopHabits />
        </Animated.View>
      </View>
    </GestureDetector>
  );

  // return (
  //   <View style={styles.container}>
  //     <Button
  //       label="Block apps"
  //       variant={ButtonVariants.PRIMARY}
  //       onPress={blockApps}
  //     />
  //     <Button
  //       label="Revoke VPN permission"
  //       variant={ButtonVariants.PRIMARY}
  //       onPress={revokeVpnPermission}
  //     />
  //     <Button
  //       label="Set Password"
  //       variant={ButtonVariants.PRIMARY}
  //       onPress={() => setModalVisible(true)}
  //     />
  //     <SetPasswordModal
  //       modalVisible={modalVisible}
  //       setModalVisible={setModalVisible}
  //     />
  //   </View>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  hero: {
    height: SCREEN_HEIGHT,
    // width: "100%",
    zIndex: 6,
  },
  listContainer: {
    // backgroundColor: "#D6F3FF",
    position: "absolute",
    zIndex: 5,
  },
});

export default IndexScreen;
