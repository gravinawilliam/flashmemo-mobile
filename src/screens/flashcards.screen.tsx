import { LoadingComponent } from '@components/loading.component';
import { useAuth } from '@hooks/use-auth.hook';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api.service';
import { storageAuthTokenGet } from '@storage/auth-token.storage';
import { AppError } from '@utils/app.error';
import { Button, Center, FlatList, HStack, Heading, Text, Icon, VStack, useToast, Box } from 'native-base';
import { useState, useCallback, Fragment } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { ButtonComponent } from '@components/button.component';
type RouteParamsProps = {
  collectionId: string;
}

type Flashcard = {
  id: string
  collection: {
    id: string
  },
  front:  string,
  responses: {
    text: string
  }[]
}

export function FlashcardsScreen() {

  const route = useRoute();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { collectionId } = route.params as RouteParamsProps;
  console.log({collectionId})
  function handleCreateFlashcard() {
    navigation.navigate('createFlashcard', { collectionId });
  }

  function handleGoBack() {
    setFlashcards([]);
    navigation.navigate('library');
  }

  async function handleCreateDeck() {
    try {
      console.log({collectionId})
      const {accessToken} = await storageAuthTokenGet();
      const response = await api({
        method: 'post',
        url: '/flashcards/build',
        headers: {
          "Authorization": `${accessToken}`
        },
        data: {
          collection: {
            id: collectionId
          }
        }
      });

      toast.show({
        title: 'Deck criado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      });

    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os flashcards';
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

  async function fetchFlashcards() {
    try {
      console.log({collectionId})
      setIsLoading(true);
      const {accessToken} = await storageAuthTokenGet();
      const response = await api({
        method: 'get',
        url: '/flashcards/list',
        headers: {
          "Authorization": `${accessToken}`,
          "collection_id": `${collectionId}`
        }
      });
      console.log(response.data);
      setFlashcards(response.data.flashcards);

    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os flashcards';
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
      fetchFlashcards()
    },[])
  )

  return (
    <VStack flex={1} marginX='10'>
      <HStack justifyContent="space-between" alignItems='center' mb={5} marginTop='16'>
        <Button background='purple.800' height='8' w='8' onPress={handleGoBack}> <Icon
              as={AntDesign}
              name="arrowleft"
              color='white'
              size={7}
            /></Button>

            <Heading color="gray.200" fontSize="xl" fontFamily="heading">
              Flashcards criados
            </Heading>
            <Button width='8' height='8' backgroundColor='purple.800' onPress={() => handleCreateFlashcard(
            )}>
                <Icon
              as={AntDesign}
              name="plussquareo"
              color='white'
              size={7}
            />
            </Button>
          </HStack>
      {  isLoading ? <LoadingComponent /> :
        flashcards.length === 0 ? <Text color='white' textAlign='center'>Nenhum flashcard criado</Text>
       :
       <VStack>
        <ButtonComponent title='Construir deck' mt='5' mb='10' onPress={handleCreateDeck}/>
        <FlatList
            data={flashcards}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Box width='full' backgroundColor='purple.900' rounded='md' minHeight='50' marginBottom='3' alignItems='center' justifyContent='center' borderWidth='2' borderColor='purple.700'>
                <Text color='white' textAlign='center'>{item.front}</Text>
              </Box>
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: 20
            }}
            />
        </VStack>
}
    </VStack>
  );
}
