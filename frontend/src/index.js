import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from './ui/provider';
import { BrowserRouter } from 'react-router-dom';
import ChatProvider from "./Context/ChatProvider";
import { ChakraProvider } from '@chakra-ui/react';
import { Provider as CustomProvider } from './ui/provider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
  <ChatProvider>
    <BrowserRouter>
    <Provider>
      <App />
    </Provider>
    </BrowserRouter>
  </ChatProvider>
  </ChakraProvider>
);
