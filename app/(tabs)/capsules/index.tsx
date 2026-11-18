import { StyleSheet, Text, View } from "react-native";

import { CardItem } from "@/components/per-screen/capsules/card-item";
import Button, { ButtonVariants } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/dimensions";
import FONT_STYLES from "@/constants/text";
import { Capsule } from "@/models/capsule";
import CapsuleRepository from "@/repository/capsule-repository";
import { usePathname, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";

const CapsulesScreen = () => {
  const router = useRouter();
  const db = useSQLiteContext();
  const capsuleRepository = new CapsuleRepository(db);
  const [loading, setLoading] = useState<boolean>(true);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const pathname = usePathname();

  const loadAllCapsules = async () => {
    const capsules = await capsuleRepository.getAll();
    setCapsules([...capsules]);
    setLoading(false);
  };

  useEffect(() => {
    if (pathname != "/capsules") return;
    loadAllCapsules();
  }, [pathname]);
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
          router.navigate("/(tabs)/capsules/create-capsule"); // Navigate back to the home screen
        }}
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
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

export default CapsulesScreen;
