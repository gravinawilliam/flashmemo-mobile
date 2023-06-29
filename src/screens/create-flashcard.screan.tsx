import { useState } from 'react';
import { useNavigation, useRoute } from "@react-navigation/native";
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/use-auth.hook';
import { api } from '@services/api.service';
import { AppError } from '@utils/app.error';
import { InputComponent } from '@components/input.component';
import { ButtonComponent } from '@components/button.component';
import { storageAuthTokenGet } from '@storage/auth-token.storage';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

type FlashcardDataProps = {
  front: string
  responses_text_1: string
  responses_text_2: string
  responses_text_3: string
}

type RouteParamsProps = {
  collectionId: string;
}

const createFlashcardSchema = yup.object({
  front: yup.string().required('Informe o enunciado.'),
  responses_text_1: yup.string().required('Informe a resposta'),
  responses_text_2: yup.string().required('Informe a resposta'),
  responses_text_3: yup.string().required('Informe a resposta'),
});


export function CreateFlashcardScreen() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FlashcardDataProps>({
    resolver: yupResolver(createFlashcardSchema),
  });

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { collectionId } = route.params as RouteParamsProps;

  function handleGoBack() {
    setIsLoading(false);
    navigation.navigate('flashcards', {collectionId });
  }

  async function handleCreateCollection(flashcard: FlashcardDataProps) {
    try {
      setIsLoading(true);
      const {accessToken} = await storageAuthTokenGet();
      const response = await api({
        method: 'post',
        url: '/flashcards/create',
        headers: {
          "Authorization": `${accessToken}`
        },
        data: {
          collection: {
            id: collectionId
          },
          flashcard: {
            front: flashcard.front,
            responses: [{
              text: flashcard.responses_text_1,
              isCorrect: true
            },{
              text: flashcard.responses_text_2,
              isCorrect: false            },{
              text: flashcard.responses_text_3,
              isCorrect: false
            },]
          }
        }
      });
      console.log(response.data);

      handleGoBack();

    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível criar o flashcard';
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

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1} paddingX='10' paddingBottom='16'>
        <Center>
          <Heading marginTop='24' marginBottom='12' color='white' fontFamily='heading' fontSize='4xl' textTransform='uppercase'>
            Flashmemo
          </Heading>

          <Text color="gray.100" textTransform='uppercase' fontSize="lg" marginBottom='10' fontFamily="body">
            Cadastrar flashcard
          </Text>

          <Controller
            control={control}
            name="front"
            rules={{ required: 'Informe o enunciado' }}
            render={({ field: { onChange } }) => (
              <InputComponent
                placeholder="Enunciado"
                keyboardType="default"
                autoCapitalize="words"
                onChangeText={onChange}
                errorMessage={errors.front?.message}
              />
            )}
          />

        <Text color="gray.100" textTransform='uppercase' fontSize="lg" marginBottom='10' fontFamily="body">
          Está é a resposta correta
        </Text>
        <Controller
            control={control}
            name="responses_text_1"
            rules={{ required: 'Informe a primeira alternativa' }}
            render={({ field: { onChange } }) => (
              <InputComponent
                placeholder="Primeira Alternativa"
                keyboardType="default"
                autoCapitalize="words"
                onChangeText={onChange}
                errorMessage={errors.responses_text_1?.message}
              />
            )}
          />

<Controller
            control={control}
            name="responses_text_2"
            rules={{ required: 'Informe a segunda alternativa' }}
            render={({ field: { onChange } }) => (
              <InputComponent
                placeholder="Segunda Alternativa"
                keyboardType="default"
                autoCapitalize="words"
                onChangeText={onChange}
                errorMessage={errors.responses_text_1?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="responses_text_3"
            rules={{ required: 'Informe a terceira alternativa' }}
            render={({ field: { onChange } }) => (
              <InputComponent
                placeholder="Terceira Alternativa"
                keyboardType="default"
                autoCapitalize="words"
                onChangeText={onChange}
                errorMessage={errors.responses_text_1?.message}
              />
            )}
          />

          <ButtonComponent
            title="Cadastrar"
            onPress={handleSubmit(handleCreateCollection)}
            isLoading={isLoading}
          />
        </Center>

        <ButtonComponent
          marginTop='10'
          title="Voltar para a coleção"
          variant="outline"
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  );
}
