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


type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password'), ''], 'A confirmação da senha não confere')
});

export function SignUpScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const { signUp } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true)
      console.log('1')
      await signUp({
        email,
        password,
        name,
      })
      console.log('ultimo')
    } catch (error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1} paddingX='10' paddingBottom='16'>
        <Center>
          <Heading marginTop='24' marginBottom='24' color='white' fontFamily='heading' fontSize='4xl' textTransform='uppercase'>
            Flashmemo
          </Heading>

          <Text color="gray.100" textTransform='uppercase' fontSize="lg" marginBottom='10' fontFamily="body">
            Cadastro
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

<Controller
            control={control}
            name="password_confirm"
            rules={{ required: 'Informe a confirmação da senha' }}
            render={({ field: { onChange } }) => (
              <InputComponent
                placeholder="Confirmar Senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <ButtonComponent
            title="Cadastrar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <ButtonComponent
          marginTop='10'
          title="Voltar para o login"
          variant="outline"
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  );
}
