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

type Collection = {
  id: string;
  name: string;
}

export function LibraryScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleCreateCollection() {
    navigation.navigate('createCollection');
  }

  function handleOpenFlashcards(collectionId: string) {
    navigation.navigate('flashcards', { collectionId });
  }

  async function fetchCollections() {
    try {
      setIsLoading(true);
      const {accessToken} = await storageAuthTokenGet();
      const response = await api({
        method: 'get',
        url: '/collections/list',
        headers: {
          "Authorization": `${accessToken}`
        }
      });
      console.log(response.data);
      setCollections(response.data.collections);

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

  useFocusEffect(
    useCallback(() => {
      fetchCollections()
    },[])
  )

  return (
    <VStack flex={1} marginX='10'>
      <Center>
          <Heading marginTop='24' marginBottom='12' color='white' fontFamily='heading' fontSize='4xl' textTransform='uppercase'>
            Flashmemo
          </Heading>
      </Center>
      <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="xl" fontFamily="heading">
              Coleções criadas
            </Heading>
            <Button width='8' height='8' backgroundColor='purple.800' onPress={handleCreateCollection}>
                <Icon
              as={AntDesign}
              name="plussquareo"
              color='white'
              size={7}
            />
            </Button>
          </HStack>
      {  isLoading ? <LoadingComponent /> :
        <FlatList
            data={collections}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Button marginBottom='5' backgroundColor='purple.700' borderColor='purple.600' borderWidth='1' onPress={() => handleOpenFlashcards(item.id)}>
                <Text color='white'>{item.name}</Text>
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
