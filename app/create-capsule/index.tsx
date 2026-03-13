import React from "react";
import { StyleSheet, View } from "react-native";
import CreateCapsuleForm from "./create-capsule-form";

const CreateCapsuleScreen: React.FC = () => {
  const [habitName, setHabitName] = React.useState<string>("");
  const [selectedApp, setSelectedApp] = React.useState<string | null>(null);
  //   const availableApps = []; // Add your list of apps here

  const handleCreate = () => {
    // Logic to create or save changes
  };

  return (
    <View style={styles.container}>
      <CreateCapsuleForm
      // habitName={habitName}
      // setHabitName={setHabitName}
      // selectedApp={selectedApp}
      // setSelectedApp={setSelectedApp}
      // availableApps={[]}
      // handleCreate={()=>{}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateCapsuleScreen;
