import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";
import { Controller, useForm } from 'react-hook-form';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { ButtonComponent } from "@components/button.component";
import { InputComponent } from "@components/input.component";
import { useState } from "react";
import { useAuth } from "@hooks/use-auth.hook";
import { AppError } from "@utils/app.error";

type FormData = {
  email: string;
  password: string;
}

export function SignInScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>()

  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  async function handleSignIn({ email, password }: FormData) {
    try {
      setIsLoading(true);
      await signIn({email, password});

    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
      setIsLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1} paddingX='10' paddingBottom='16'>
        <Center>
          <Heading marginTop='24' marginBottom='24' color='white' fontFamily='heading' fontSize='4xl' textTransform='uppercase'>
            Flashmemo
          </Heading>

          <Text color="gray.100" textTransform='uppercase' fontSize="lg"  marginBottom='10' fontFamily="body">
            Login
          </Text>

          <Controller
            control={control}
            name="email"
            rules={{ required: 'Informe o e-mail' }}
            render={({ field: { onChange } }) => (
              <InputComponent
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{ required: 'Informe a senha' }}
            render={({ field: { onChange } }) => (
              <InputComponent
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <ButtonComponent
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />

          <Text color="gray.100" fontSize="sm" marginTop='10' marginBottom='5' fontFamily="body">
            Ainda não tem acesso?
          </Text>

          <ButtonComponent
            title="Criar Conta"
            variant="outline"
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
