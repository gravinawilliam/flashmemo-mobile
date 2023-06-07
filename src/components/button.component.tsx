import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base';

type Props = IButtonProps & {
  title: string;
  variant?: 'solid' | 'outline';
}

export function ButtonComponent({ title, variant = 'solid', ...rest }: Props) {
  return (
    <ButtonNativeBase
      width="full"
      height="14"
      bg={variant === 'outline' ? 'transparent' : 'purple.500'}
      borderWidth={variant === 'outline' ? '2' : '0'}
      borderColor="purple.500"
      rounded="xl"
      _pressed={{
        bg: 'purple.700',
      }}
      {...rest}
    >
      <Text
        color='white'
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
