import { Modal } from "@/components/ui/modal";
import { DELETE_CONFIRMATION_PASSWORD_KEY } from "@/constants/password";
import { Capsule } from "@/models/capsule";
import { getPassword, hashPassword } from "@/utils/expo/crypto/password-utils";
import { deleteCapsule } from "@/utils/expo/sqlite/capsules-repository";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface ConfirmDeletePasswordModalProps {
  capsule: Capsule;
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  onPressDelete?: () => void;
}

export const ConfirmDeletePasswordModal = ({
  capsule,
  modalVisible,
  setModalVisible,
  onPressDelete,
}: ConfirmDeletePasswordModalProps) => {
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const onConfirm = async () => {
    const storedHash = await getPassword(DELETE_CONFIRMATION_PASSWORD_KEY);
    const enteredHash = await hashPassword(password);

    if (enteredHash !== storedHash) {
      setError("Incorrect password. Please try again.");
      return;
    }

    handleDelete(capsule.id);
    onCancel();
  };

  const handleDelete = async (id: number | undefined) => {
    try {
      if (!id) return;

      if (typeof window !== "undefined") {
        console.log(`Deleting capsule with ID: ${id}`);
      }

      await deleteCapsule(id);
      onPressDelete && onPressDelete();
    } catch (error) {
      console.error("Failed to delete capsule:", error);
    }
  };
  const onCancel = () => {
    setPassword("");
    setError("");
    setModalVisible(false);
  };

  return (
    <Modal
      visible={modalVisible}
      title="Confirm Delete"
      onCancel={onCancel}
      onConfirm={onConfirm}
      cancelLabel="Cancel"
      confirmLabel="Delete"
    >
      <View style={styles.container}>
        <Text style={styles.description}>
          Please enter your password to confirm deletion.
        </Text>
        <TextInput
          style={[styles.input, error !== "" && styles.inputError]}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
        />
        {error !== "" && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  inputError: {
    borderColor: "#FF5252",
  },
  errorText: {
    color: "#FF5252",
    fontSize: 12,
  },
});
