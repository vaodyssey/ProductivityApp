import Button, { ButtonVariants } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { COLOR_PRIMARY } from "@/constants/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import FONT_STYLES from "@/constants/text";
import { Capsule } from "@/models/Capsule";
import { readAllCapsules } from "@/utils/expo/sqlite/capsules-repository";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const IndexScreen = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const pathname = usePathname();

  const loadAllCapsules = async () => {
    const capsules = await readAllCapsules();
    setCapsules([...capsules]);
    setLoading(false);
  };
  useEffect(() => {
    if (pathname != "/") return;
    loadAllCapsules();
  }, [pathname]);
  return (
    <View style={styles.container}>
      {loading && <Spinner />}
      {capsules.length === 0 ? (
        <NoCapsuleSection />
      ) : (
        <>
          {capsules.map((capsule) => {
            return (
              <Text style={{ color: COLOR_PRIMARY }}>
                {capsule.appPackageName}
              </Text>
            );
          })}
        </>
      )}
    </View>
  );
};

const NoCapsuleSection = () => {
  const router = useRouter();
  return (
    <>
      <Text style={{ ...FONT_STYLES.BODY_STYLE, textAlign: "center" }}>
        You don't have any Capsule of Shame for now. Click Create to get
        started!
      </Text>

      <Button
        label="Create"
        variant={ButtonVariants.PRIMARY}
        onPress={() => {
          router.navigate("/create-capsule"); // Navigate back to the home screen
        }}
      />
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
