import { AUTH_STORAGE } from '@configs/storage.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type StorageAuthTokenProps = {
  accessToken: string;
}

export async function storageAuthTokenSave({accessToken}: StorageAuthTokenProps) {
  await AsyncStorage.setItem(AUTH_STORAGE, JSON.stringify({ accessToken }));
}

export async function storageAuthTokenGet(): Promise<StorageAuthTokenProps> {
  console.log('storageAuthTokenGet');
  const response = await AsyncStorage.getItem(AUTH_STORAGE);
  console.log('storageAuthTokenGet 2');

  const { accessToken }: StorageAuthTokenProps = response ? JSON.parse(response) : {}
  console.log('storageAuthTokenGet 3');

  return { accessToken };
}

export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(AUTH_STORAGE);
}
