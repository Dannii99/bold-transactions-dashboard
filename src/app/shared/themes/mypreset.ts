import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#E4E6F4',
      100: '#C8CBE9',
      200: '#A1A8D6',
      300: '#7A85C3',
      400: '#5362B0',
      500: '#121E6C', // azul bold
      600: '#0D1652',
      700: '#090E38',
      800: '#05071E',
      900: '#02030C'
    },
    secondary: {
      50: '#ffe8e9',
      100: '#ffcfd2',
      200: '#f99ea3',
      300: '#f36d74',
      400: '#EE424E',
      500: '#EE424E', // rojo bold
      600: '#d93c47',
      700: '#b8343d',
      800: '#982d34',
      900: '#6a2126',
      950: '#4a171a'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#F6F4F9', // background claro bold
          100: '#F3F3F3', // gris claro bold
          200: '#E5E5E5'
        },
        text: {
          color: '#606060' // gris oscuro bold
        }
      },
      dark: {
        surface: {
          0: '#121212',
          50: '#1e1e1e'
        }
      }
    }
  },

    variables: {
    'border-radius': '0.5rem',       // para botones, inputs, paneles
    'button-padding': '0.5rem 1.2rem',
    'button-height': '8rem',
    'border-width': '2px'
  }
});

export default MyPreset;
