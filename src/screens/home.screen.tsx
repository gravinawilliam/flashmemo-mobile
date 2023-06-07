import { Center, Heading, VStack } from 'native-base';
import { useAuth } from '@hooks/use-auth.hook';

export function Home() {
  const { user } = useAuth();

  return (
    <VStack flex={1}>
      <Center marginTop='72'>
        <Heading fontFamily="heading" color='white'>
          Olá {user.name}
        </Heading>
      </Center>
    </VStack>
  );
}
