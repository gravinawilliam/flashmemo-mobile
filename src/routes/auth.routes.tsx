import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SignInScreen } from '@screens/sign-in.screen';
import { SignUpScreen } from '@screens/sign-up.screen';

type AuthRoutes = {
  signIn: undefined;
  signUp: undefined;
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen
        name="signIn"
        component={SignInScreen}
      />

      <Screen
        name="signUp"
        component={SignUpScreen}
      />
    </Navigator>
  )
}
