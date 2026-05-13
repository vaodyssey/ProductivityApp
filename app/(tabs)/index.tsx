import { showAlertDialog } from "@/components/ui/alert-dialog";
import Button, { ButtonVariants } from "@/components/ui/button";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import { Capsule } from "@/models/Capsule";
import VpnAppBlockerModule from "@/modules/vpn-app-blocker-module/src/VpnAppBlockerModule";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const IndexScreen = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);

  const revokeVpnPermission = async () => {
    const vpnIsStopped = await VpnAppBlockerModule.stopVpn();
    if (!vpnIsStopped) return;
    const tappedButton = await showAlertDialog({
      title: "VPN Connection Stopped",
      message:
        "You have successfully revoked VPN permission for this application.",
      buttons: [{ text: "Okay" }],
    });
  };

  const askUserPermission = async () => {
    const tappedButton = await showAlertDialog({
      title: "VPN Permission Required",
      message:
        "This app needs to set up a local VPN connection to block selected apps from the internet. " +
        "Your traffic never leaves your device.",
      buttons: [{ text: "Deny", style: "cancel" }, { text: "Allow" }],
    });

    if (tappedButton !== "Allow") return false;
    return true;
  };

  const blockApps = async (): Promise<void> => {
    const vpnIntent = await VpnAppBlockerModule.checkVpnPermission();
    let userAgree = false;
    if (vpnIntent) userAgree = await askUserPermission();
    else userAgree = true;
    if (!userAgree) return;
    VpnAppBlockerModule.requestVpnPermission();
    const blockedPackages = capsules.map((capsules) => {
      return capsules.appPackageName;
    });
    VpnAppBlockerModule.startVpn(blockedPackages);
  };

  return (
    <View style={styles.container}>
      <Button
        label="Block apps"
        variant={ButtonVariants.PRIMARY}
        onPress={blockApps}
      />
      <Button
        label="Revoke VPN permission"
        variant={ButtonVariants.PRIMARY}
        onPress={revokeVpnPermission}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SCREEN_HEIGHT * 0.02,
    padding: SCREEN_WIDTH * 0.2,
  },
});

export default IndexScreen;
