import { THEME } from '../theme/default'

type MyThemeType = typeof THEME;

declare module "native-base" {
  interface ICustomTheme extends MyThemeType {}
}
