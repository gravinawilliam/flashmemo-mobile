import { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
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

type CollectionDataProps = {
    name: string;
    description: string;
}

const createCollectionSchema = yup.object({
    name: yup.string().required('Informe o nome da coleção.'),
    description: yup.string().required('Informe a descrição da coleção.'),
});


export function CreateCollectionScreen() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<CollectionDataProps>({
    resolver: yupResolver(createCollectionSchema),
  });

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleGoBack() {
    setIsLoading(false);
    navigation.navigate('library');
  }

  async function handleCreateCollection(collection: CollectionDataProps) {
    try {
      setIsLoading(true);
      const {accessToken} = await storageAuthTokenGet();
      const response = await api({
        method: 'post',
        url: '/collections/create',
        headers: {
          "Authorization": `${accessToken}`
        },
        data: {
          collection: {
            ...collection,
            category: {
              id: '11898c4e-f133-49df-9ca9-974da46e5310'
            },
            privacyStatus: 'public'
          }
        }
      });
      console.log(response.data);

      handleGoBack();

    } catch (error: any) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar as collections';
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
            Cadastrar coleção
          </Text>

          <Controller
            control={control}
            name="name"
            rules={{ required: 'Informe o seu nome' }}
            render={({ field: { onChange } }) => (
              <InputComponent
                placeholder="Nome"
                keyboardType="default"
                autoCapitalize="words"
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

        <Controller
            control={control}
            name="description"
            rules={{ required: 'Informe a descrição' }}
            render={({ field: { onChange } }) => (
              <InputComponent
                placeholder="Descrição"
                keyboardType="default"
                autoCapitalize="words"
                onChangeText={onChange}
                errorMessage={errors.description?.message}
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
          title="Voltar para a biblioteca de coleções"
          variant="outline"
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  );
}
