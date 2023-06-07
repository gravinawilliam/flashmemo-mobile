import { User } from "@entities/user.entity";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { USER_STORAGE } from '@configs/storage.config';

export async function storageUserSave(parameters: {user: User}) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(parameters.user))
}

export async function storageUserGet(): Promise<User> {
  const storage = await AsyncStorage.getItem(USER_STORAGE);

  const user: User = storage ? JSON.parse(storage) : {};

  return user
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(USER_STORAGE);
}
