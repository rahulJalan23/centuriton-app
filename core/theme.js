import { DefaultTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "#000000",
    primary: "#03abab",
    secondary: "#C980AD",
    tertiary: "#DFCCD7",
    error: "#f13a59",

    white: "#fff",
    black: "#000",
    searchIcon: "#999",
    searchText: "#444",
    searchBackground: "#f0f0f0",
    title: "#000",
    subTitle: "#555",
    storyBorder: "#00f",
    description: "#9f9f9f",
    inputBackground: "#f0f0f0",
    inputText: "#000",
    messageBackground: "#1B5583",
    danger: "#df4759",
    success: "#4b0",
    light: "#ccc",
    halfOpacitySecondary: "rgba(240, 149, 17, 0.5)",
    halfOpacityPrimary: "rgba(0, 132, 255, 0.5)",
    storyBorder: "#00f",
  },
  fontSize: {
    title: 18,
    subTitle: 13,
    message: 15,
  },
};
