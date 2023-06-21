import { ButtonComponent } from "@components/button.component";
import { LoadingComponent } from "@components/loading.component";
import { useFocusEffect, useRoute,useNavigation } from "@react-navigation/native";
import { api } from "@services/api.service";
import { storageAuthTokenGet } from "@storage/auth-token.storage";
import { AppError } from "@utils/app.error";
import { Box, Button, Center, FlatList, Heading, Radio, SectionList, Text, VStack, useToast } from "native-base";
import { useCallback, useState } from "react";
import { AppNavigatorRoutesProps } from '@routes/app.routes';

type ResponseType = {
  id: string
  text: string
}

type Flashcard = {
  id: string
  front: string
  responses: ResponseType[]
}

export type Deck = {
  id: string
  collection: {
    id: string
  }
  flashcards: Flashcard[]
}

type RouteParamsProps = {
  deckId: string;
}

export function AnswerDeckScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFinish, setIsLoadingFinish] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [deck, setDeck] = useState<Deck>();
  const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard>();
  const [responses, setResponses] = useState<{
    id: string
    responseId: string
  }[]>([])
  const [result, setResult] = useState<{
    winners: number;
    losers: number;
  }>();
  const [step, setStep] = useState<number>(1);

  const toast = useToast();
  const route = useRoute();
  const { deckId } = route.params as RouteParamsProps;
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  async function fetchDeck() {
    const { accessToken } = await storageAuthTokenGet();
    try {
      setIsLoading(true);
      const response = await api({
        method: 'get',
        url: '/decks/find',
        headers: {
          "Authorization": `${accessToken}`,
          deck_id: deckId
        }
      });
      console.log(response.data);
      setDeck(response.data.deck);
      setCurrentFlashcard(response.data.deck.flashcards[0]);

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

  function handleGoBack() {
    setIsLoading(true);
    setIsLoadingFinish(false);
    setIsFinish(false);
    setResponses([])
    setStep(1);

    navigation.goBack()
  }

  async function answerQuestion(responseId: string) {
    console.log({
      step,
      deckLength: deck!.flashcards.length,
      responsesLength: responses.length
    })


    setResponses(oldArray => [...oldArray, {
      id: currentFlashcard!.id,
      responseId
    }]);

    setCurrentFlashcard(deck!.flashcards[step]);
    setStep(step + 1);

    if (step === deck!.flashcards.length) {
      console.log('finish');
      setIsLoadingFinish(true);
      const { accessToken } = await storageAuthTokenGet();
      try {
      const response = await api({
        method: 'post',
        url: '/decks/answer',
        headers: {
          "Authorization": `${accessToken}`,
        },
        data: {
          deck: {
            id: deck!.id,
            flashcards: responses
          }
        }
      });
      console.log(response.data);
      setResult({
        losers: response.data.deck.flashcards.filter((flashcard: any) => flashcard.isWinner === false).length,
        winners: response.data.deck.flashcards.filter((flashcard: any) => flashcard.isWinner === true).length,
      });
      setIsFinish(true);
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
      setIsLoadingFinish(false);
    }
    }

  }

  useFocusEffect(
    useCallback(() => {
      fetchDeck()
    }, [])
  )

  return (
    <VStack flex={1} marginX='10'>
      {
        isLoadingFinish ? <LoadingComponent />
        :
        isLoading ?
          <LoadingComponent />
          : isFinish ?
          <Center marginTop='12'>
            <Heading size='lg' marginBottom='5' color='white'>Parabéns!</Heading>
            <Text color='white'>Você concluiu o deck!</Text>
            <Text color='white'>Você obteve {result?.winners} acertos e {result?.losers} errors</Text>
            <ButtonComponent
              marginTop='10'
              title="Voltar para a coleção"
              variant="outline"
              onPress={handleGoBack}
            />
          </Center>
          :
          deck === undefined ? <Text></Text> :
            <Center marginTop='12'>
              <Heading size='lg' marginBottom='5' color='white'>{currentFlashcard?.front}</Heading>
              <FlatList
              data={currentFlashcard?.responses}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Button marginBottom='2' w='72' justifyContent='flex-start' background='purple.600' rounded='lg'
                  onPress={() => answerQuestion(item.id)}
                >
                  <Text  w='full' color='white'>{item.text}</Text>
                </Button>
              )}
              showsVerticalScrollIndicator={false}
              _contentContainerStyle={{
                paddingBottom: 20
              }}
            />
            </Center>
      }
    </VStack>
  );
}
