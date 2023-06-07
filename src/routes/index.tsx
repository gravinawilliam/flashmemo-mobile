import { useContext } from 'react';

import { useTheme, Box } from 'native-base';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { useAuth } from '@hooks/use-auth.hook';

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { LoadingComponent } from '@components/loading.component';

export function Routes() {
  const { colors } = useTheme();

  const { user, isLoadingUserStorageData } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.purple[800];

  if(isLoadingUserStorageData) {
    return <LoadingComponent />
  }

  return (
    <Box flex={1} bg="purple.800">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
