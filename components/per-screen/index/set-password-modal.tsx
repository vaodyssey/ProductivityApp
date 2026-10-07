import { Modal } from "@/components/ui/modal";
import { DELETE_CONFIRMATION_PASSWORD_KEY } from "@/constants/password";
import { savePassword } from "@/utils/expo/crypto/password-utils";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface SetPasswordModalProps {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
}

export const SetPasswordModal = ({
  modalVisible,
  setModalVisible,
}: SetPasswordModalProps) => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const passwordsMatch = password !== "" && password === confirmPassword;

  const onConfirm = async () => {
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    await savePassword(DELETE_CONFIRMATION_PASSWORD_KEY, password);
    setPassword("");
    setConfirmPassword("");
    setError("");
    setModalVisible(false);
  };

  const onCancel = () => {
    setPassword("");
    setConfirmPassword("");
    setError("");
    setModalVisible(false);
  };

  return (
    <Modal
      visible={modalVisible}
      title="Set Password"
      onCancel={onCancel}
      onConfirm={onConfirm}
      cancelLabel="Cancel"
      confirmLabel="Save"
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
        />
        <TextInput
          style={[
            styles.input,
            confirmPassword !== "" && !passwordsMatch && styles.inputError,
          ]}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
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
