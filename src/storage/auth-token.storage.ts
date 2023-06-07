import { AUTH_STORAGE } from '@configs/storage.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type StorageAuthTokenProps = {
  accessToken: string;
}

export async function storageAuthTokenSave({accessToken}: StorageAuthTokenProps) {
  await AsyncStorage.setItem(AUTH_STORAGE, JSON.stringify({ accessToken }));
}

export async function storageAuthTokenGet(): Promise<StorageAuthTokenProps> {
  const response = await AsyncStorage.getItem(AUTH_STORAGE);

  const { accessToken }: StorageAuthTokenProps = response ? JSON.parse(response) : {}

  return { accessToken };
}

export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(AUTH_STORAGE);
}
