import { createContext, ReactNode, useEffect, useState } from "react";

import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from '@storage/auth-token.storage';
import { storageUserGet, storageUserRemove, storageUserSave } from '@storage/user.storage';

import { api } from '@services/api.service';
import { User } from "@entities/user.entity";

export type AuthContextDataProps = {
  user: User;
  signIn: (parameters: { email: string, password: string }) => Promise<void>;
  signUp: (parameters: { email: string, password: string, name: string }) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {

  const [user, setUser] = useState<User>({} as User);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

  async function userAndTokenUpdate(parameters: { userData: User, accessToken: string }) {
    api.defaults.headers.common['Authorization'] = `Bearer ${parameters.accessToken}`;

    setUser(parameters.userData);
  }

  async function storageUserAndTokenSave(parameters: { userData: User, accessToken: string }) {
    try {
      setIsLoadingUserStorageData(true)
      await storageUserSave({ user: parameters.userData });
      await storageAuthTokenSave({ accessToken: parameters.accessToken });

    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signUp(parameters: { email: string, password: string, name: string }) {
    try {
      console.log('2')
      const result = await api({
        method: 'post',
        url: '/sign-up',
        data: {
          email: parameters.email,
          password: parameters.password,
          name: parameters.name
        }
      });

      if (result.data.user && result.data.access_token) {
        await storageUserAndTokenSave({
          userData: result.data.user,
          accessToken: result.data.access_token
        });
        userAndTokenUpdate({
          accessToken: result.data.access_token,
          userData: result.data.user
        })
      }
    } catch (error) {
      console.log(error)

      throw error
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn(parameters: { email: string, password: string }) {
    try {
      const { data } = await api.post('/sign-in', {
        email: parameters.email,
        password: parameters.password,
      });

      if (data.user && data.access_token) {
        await storageUserAndTokenSave({
          userData: data.user,
          accessToken: data.access_token
        });
        userAndTokenUpdate({
          accessToken: data.access_token,
          userData: data.user
        })
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as User);
      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();
      const { accessToken } = await storageAuthTokenGet();

      if (accessToken && userLogged) {
        userAndTokenUpdate({
          accessToken,
          userData: userLogged
        });
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      signUp,
      signOut,
      isLoadingUserStorageData
    }}>
      {children}
    </AuthContext.Provider>
  )
}
