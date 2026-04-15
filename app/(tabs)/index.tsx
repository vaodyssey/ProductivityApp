import { showAlertDialog } from "@/components/ui/alert-dialog";
import Button, { ButtonVariants } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import FONT_STYLES from "@/constants/text";
import { Capsule } from "@/models/Capsule";
import VpnAppBlockerModule from "@/modules/vpn-app-blocker-module/src/VpnAppBlockerModule";
import { readAllCapsules } from "@/utils/expo/sqlite/capsules-repository";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CardItem } from "./card-item";

const IndexScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const pathname = usePathname();

  const loadAllCapsules = async () => {
    const capsules = await readAllCapsules();
    setCapsules([...capsules]);
    setLoading(false);
  };
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
    const startVpnResult = await VpnAppBlockerModule.startVpn(blockedPackages);
    // console.log(startVpnResult);
  };
  useEffect(() => {
    if (pathname != "/") return;
    loadAllCapsules();
  }, [pathname]);

  useEffect(() => {
    if (capsules.length === 0) return;
    blockApps();
  }, [capsules]);
  return (
    <View style={styles.container}>
      {loading && <Spinner />}
      {capsules.length === 0 ? (
        <NoCapsuleSection />
      ) : (
        <>
          {capsules.map((capsule, index) => {
            return (
              <CardItem
                capsule={capsule}
                key={index}
                onPressDelete={() => loadAllCapsules()}
              />
            );
          })}
        </>
      )}
      <Button
        label="Create"
        variant={ButtonVariants.PRIMARY}
        onPress={() => {
          router.navigate("/create-capsule"); // Navigate back to the home screen
        }}
      />
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

const NoCapsuleSection = () => {
  return (
    <>
      <Text style={{ ...FONT_STYLES.BODY_STYLE, textAlign: "center" }}>
        You don't have any Capsule of Shame for now. Click Create to get
        started!
      </Text>
    </>
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
