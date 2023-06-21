import { Button, Center, FlatList, Heading, SectionList, VStack, useToast, Text, HStack, Icon } from 'native-base';
import { useAuth } from '@hooks/use-auth.hook';
import { useCallback, useState } from 'react';
import { api } from '@services/api.service';
import { AppError } from '@utils/app.error';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LoadingComponent } from '@components/loading.component';
import { TouchableOpacity } from 'react-native';
import { ButtonComponent } from '@components/button.component';
import { storageAuthTokenGet } from '@storage/auth-token.storage';
import { AntDesign } from '@expo/vector-icons';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

export type Deck = {
  id: string
  collection: {
    id: string
    name: string
  }
}

export function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [decks, setDecks] = useState<Deck[]>([]);

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleAnswerDeck(deckId: string) {
    navigation.navigate('answerDeck', { deckId });
  }

  // function handleOpenFlashcards(collectionId: string) {
  //   navigation.navigate('flashcards', { collectionId });
  // }

  async function fetchDecks() {
    try {
      setIsLoading(true);
      const {accessToken} = await storageAuthTokenGet();
      const response = await api({
        method: 'get',
        url: '/decks/list',
        headers: {
          "Authorization": `${accessToken}`
        }
      });
      console.log(response.data);
      setDecks(response.data.decksUnanswered);

    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os decks';
      console.log(error);

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchDecks()
    },[])
  )

  return (
    <VStack flex={1} marginX='10'>
      <Center marginBottom='12'>
        <Heading marginTop='24' marginBottom='6' color='white' fontFamily='heading' fontSize='4xl' textTransform='uppercase'>
          Flashmemo
        </Heading>
        <Text color='gray.200' fontSize='xl' fontFamily='body'>
          Decks para responder
        </Text>
      </Center>
   {   isLoading ? <LoadingComponent /> : decks.length === 0 ?
    <Center>
      <Text color='gray.200' fontSize='xl' mt='48' fontFamily='body'>
        Você não possui decks para responder
      </Text>
    </Center>
   : <FlatList
        data={decks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Button marginBottom='5' backgroundColor='purple.700' h='14' borderColor='purple.600' borderWidth='1' justifyContent='flex-start' onPress={() => handleAnswerDeck(item.id)}>
            <Text color='white' fontSize='lg'>{item.collection.name}</Text>
          </Button>
        )}
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{
          paddingBottom: 20
        }}
      />
}
    </VStack>
  );
}
