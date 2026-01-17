// src/theme.js
import { createTheme } from "@mui/material/styles";

const colors = {
  cream: "#f6f1e7",
  sage: "#c9d6c1",
  sageDark: "#9fb3a3",
  ink: "#2a2a2a",
  inkSoft: "#4a4a4a",
  border: "rgba(0,0,0,0.12)",
};

const theme = createTheme({
  typography: {
    // Default font for body text, buttons, etc.
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),

    // Headings use Borel
    h1: {
      fontFamily: "Borel, cursive",
      fontSize: "clamp(2.8rem, 6vw, 6.5rem)",
      lineHeight: .3,
      letterSpacing: "0.04em",
      color: colors.ink,
    },
    h2: {
      fontFamily: "Borel, cursive",
      lineHeight: .6
    },
    h3: {
      fontFamily: "Borel, cursive",
    },
    h4: {
      fontFamily: "Borel, cursive",
    },
    h5: {
      fontFamily: "Inter, sans-serif",
    },
    h6: {
      fontFamily: "Inter, sans-serif",
    },

    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  palette: {
    mode: "light",

    background: {
      default: colors.cream,
      paper: "#fffff5ff",
    },

    primary: {
      main: colors.sageDark,
      contrastText: colors.ink,
    },

    secondary: {
      main: colors.ink,
    },

    text: {
      primary: colors.ink,
      secondary: colors.inkSoft,
    },

    divider: colors.border,
},
components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: colors.ink,
          textDecorationColor: colors.sageDark,
          textUnderlineOffset: "3px",
          textDecorationThickness: "1.5px",

          "&:hover": {
            color: colors.ink,
            textDecorationColor: colors.ink,
          },
        },
      },
    },
  },
});

export default theme;
