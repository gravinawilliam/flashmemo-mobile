import { StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { useFonts, SpaceGrotesk_400Regular,SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';

import { Routes } from '@routes/index';

import { AuthContextProvider } from '@contexts/auth.context';

import { THEME } from './theme/default';
import { LoadingComponent } from '@components/loading.component';


export const Main = () => {
  const [fontsLoaded] = useFonts({SpaceGrotesk_400Regular,SpaceGrotesk_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <LoadingComponent />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
