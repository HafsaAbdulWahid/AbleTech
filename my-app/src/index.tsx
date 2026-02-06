import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ChakraProvider>
    <ColorModeScript />
      <BrowserRouter>
      <App />
      </BrowserRouter>
  </ChakraProvider>
);

reportWebVitals();
