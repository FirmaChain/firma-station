import 'styled-components';
import theme from './themes';

type AppTheme = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
