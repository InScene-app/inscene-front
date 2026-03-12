import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    subtle?: string;
    tag?: string;
    border?: string;
    hover?: string;
    urgent?: string;
  }

  interface PaletteOptions {
    background?: Partial<TypeBackground>;
  }
}

export {};
