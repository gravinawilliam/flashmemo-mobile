import { Center, Spinner } from 'native-base';

export function LoadingComponent() {
  return (
    <Center flex="1" bg="purple.800">
      <Spinner color="white" />
    </Center>
  );
}

