import { Input as NativeBaseInput, IInputProps, FormControl } from 'native-base';

type Props = IInputProps & {
  errorMessage?: string | null;
}

export function InputComponent({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput
        bg="purple.800"
        height='12'
        paddingX='4'
        borderWidth='2'
        borderRadius='lg'
        fontSize="md"
        color="white"
        fontFamily="body"
        borderColor='purple.500'
        placeholderTextColor="gray.300"
        isInvalid={invalid}
        _invalid={{
          borderWidth: '2',
          borderColor: "red.500"
        }}
        _focus={{
          bgColor: "purple.900",
          borderWidth: '2',
          borderColor: 'purple.500'
        }}
        {...rest}
      />

      <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
