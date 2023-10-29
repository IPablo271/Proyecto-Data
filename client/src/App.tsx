import '@mantine/core/styles.css';
import { Router } from './Router';

import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';

const myColor: MantineColorsTuple = [
  '#e5feee',
  '#d2f9e0',
  '#a8f1c0',
  '#7aea9f',
  '#53e383',
  '#3bdf70',
  '#2bdd66',
  '#1ac455',
  '#0caf49',
  '#00963c'
];

const theme = createTheme({
  colors: {
    myColor,
  }
});

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Router />
    </MantineProvider>
  );
}
