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
      900: '#02030C',
    },
    secondary: {
      50: '#ffe8e9',
      100: '#ffcfd2',
      200: '#f99ea3',
      300: '#f36d74',
      400: '#e64f5a',
      500: '#EE424E', // rojo bold
      600: '#d93c47',
      700: '#b8343d',
      800: '#982d34',
      900: '#6a2126',
      950: '#4a171a',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#F6F4F9', // background claro bold
          100: '#F3F3F3', // gris claro bold
          200: '#E5E5E5',
        },
        text: {
          color: '#606060', // gris oscuro bold
        },
        icon: {
          0: '#ffffff',
          10: '#d8d8d8',
        },
      },
      dark: {
        surface: {
          0: '#121212',
          50: '#1e1e1e',
        },
      },
    },
  },
  components: {
    // custom button tokens and additional style
    button: {
      extend: {
        accent: {
          color: '#EE424E',
          inverseColor: '#ffffff',
          hover: '#e64f5a',
          focus: '#ffc8cc7d',
        },
        padding: '0.65rem 1.2rem',
      },
      css: ({ dt }) => `
.p-button-accent {
  background: ${dt('button.accent.color')};
  color: ${dt('button.accent.inverse.color')};
  transition-duration: ${dt('my.transition.fast')};
  border: 1px solid ${dt('button.accent.color')};
  border-radius: 100px;
  padding: ${dt('button.padding')};
}
  .p-button-accent:not(:disabled):hover  {
  background: ${dt('button.accent.hover')};
  border: 1px solid ${dt('button.accent.hover')};
  color: var(--p-button-primary-hover-color);
}

.p-button-accent span.p-ink {
  background: ${dt('button.accent.focus')};
}
`,
    },
    inputgroupaddon: {
      // tokens personalizados
      extend: {},
      css: ({ dt }: any) => `
        .p-inputgroup-addon-search {
          color: ${dt('semantic.colorScheme.light.icon.10')};
          padding: 0.5rem;
          border-block-start: 0;
          border-block-end: 0;
        }

        .p-inputgroup-addon-search:first-child {
          border-start-start-radius: 0;
          border-end-start-radius: 0;
          border-inline-start: none;
        }
      `,
    },
    inputtext: {
      // tokens personalizados
      extend: {
        field: {
          background: '{semantic.colorScheme.light.surface.0}',
          color: '{semantic.colorScheme.light.text.color}',
          placeholderColor: '{semantic.colorScheme.light.icon.10}',
          borderColor: '{semantic.colorScheme.light.surface.200}',
          borderRadius: '0.5rem',
          padding: '0.5rem 1rem',
          focusBorder: '{semantic.primary.500}', // azul
        },
      },
      css: ({ dt }: any) => `
    .p-inputtext-search {
      color: ${dt('inputtext.field.color')};
      border: none;
      border-radius: 0;
      padding: ${dt('inputtext.field.padding')};
      transition: all 0.25s ease;
    }

    .p-inputtext-search:focus {
      outline: none;
      border-color: none;
      box-shadow: 0 0 0 2px ${dt('inputtext.field.focusBorder')}33; /* con transparencia */
    }

    .p-inputtext-search::placeholder {
      color: ${dt('semantic.colorScheme.light.icon.color')}80; /* placeholder más suave */
    }

    p-inputtext::placeholder {
      color: ${dt('inputtext.field.placeholderColor')};
      font-weight: 600;
      opacity: 1;
    }
  `,
    },
  },
  // common tokens and styles
  extend: {
    my: {
      transition: {
        slow: '0.75s',
        normal: '0.5s',
        fast: '0.25s',
      },
      imageDisplay: 'block',
    },
  },
  css: ({ dt }) => `
      /* Global CSS */
      img {
          display: ${dt('my.image.display')};
      }
  `,
});

export default MyPreset;
