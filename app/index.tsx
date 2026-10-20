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
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

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
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      snapToInterval={SCREEN_HEIGHT} // 👈 Tells ScrollView where to stop
      snapToAlignment="center"
      decelerationRate="fast"
      scrollEnabled={false}
      nestedScrollEnabled={false}
    >
      <ProgressBuddy scrollViewRef={scrollViewRef} />
      <MyTopHabits scrollViewRef={scrollViewRef} />
    </ScrollView>
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
  },
});

export default IndexScreen;
