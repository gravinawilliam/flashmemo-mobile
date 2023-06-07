import { Platform } from 'react-native';
import { Icon, useTheme } from 'native-base';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { Home } from '@screens/home.screen';

type AppRoutes = {
  home: undefined;
  profile: undefined;
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {

  const { sizes, colors } = useTheme();

  const iconSize = sizes[6];

  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.purple[500],
      tabBarInactiveTintColor: colors.gray[700],
      tabBarStyle: {
        backgroundColor: colors.purple[900],
        borderTopWidth: 0,
        height: Platform.OS === "android" ? 'auto' : 96,
        paddingBottom: sizes[10],
        paddingTop: sizes[6]
      }
    }}>
      <Screen
        name='home'
        component={Home}
        options={{
          tabBarIcon: ({ color,  }) => (
            <Icon
          as={AntDesign}
          name="home"
          color={color}
          size={7}
        />
          )
        }}
      />
    </Navigator>
  );
}
