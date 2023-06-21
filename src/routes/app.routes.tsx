import { Platform } from 'react-native';
import { Icon, useTheme } from 'native-base';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { HomeScreen } from '@screens/home.screen';
import { LibraryScreen } from '@screens/library.screen';
import { CreateCollectionScreen } from '@screens/create-collection.screen';
import { FlashcardsScreen } from '@screens/flashcards.screen';
import { CreateFlashcardScreen } from '@screens/create-flashcard.screan';
import { AnswerDeckScreen } from '@screens/answer-deck.screen';

type AppRoutes = {
  home: undefined;
  library: undefined;
  createCollection: undefined;
  profile: undefined;
  createFlashcard: {
    collectionId: string;
  };
  flashcards: {
    collectionId: string;
  };
  answerDeck: {
    deckId: string;
  };
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
      tabBarActiveTintColor: colors.purple[600],
      tabBarInactiveTintColor: colors.purple[500],
      tabBarStyle: {
        backgroundColor: colors.purple[800],
        borderTopWidth: 0,
        height: Platform.OS === "android" ? 'auto' : 96,
        paddingBottom: sizes[10],
        paddingTop: sizes[6]
      }
    }}>
      <Screen
        name='home'
        component={HomeScreen}
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
      <Screen
        name='library'
        component={LibraryScreen}
        options={{
          tabBarIcon: ({ color,  }) => (
            <Icon
          as={AntDesign}
          name="book"
          color={color}
          size={7}
        />
          )
        }}
      />

      <Screen
        name='createCollection'
        component={CreateCollectionScreen}
        options={{ tabBarButton: () => null }}
      />

    <Screen
        name='flashcards'
        component={FlashcardsScreen}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name='createFlashcard'
        component={CreateFlashcardScreen}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name='answerDeck'
        component={AnswerDeckScreen}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}
