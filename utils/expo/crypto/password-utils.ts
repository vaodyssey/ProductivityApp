import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

export const hashPassword = async (password: string): Promise<string> => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  );
};

export const savePassword = async (
  passwordKey: string,
  password: string,
): Promise<void> => {
  const hash = await hashPassword(password);
  await SecureStore.setItemAsync(passwordKey, hash);
};

export const getPassword = async (
  password_key: string,
): Promise<string | null> => {
  return await SecureStore.getItemAsync(password_key);
};
