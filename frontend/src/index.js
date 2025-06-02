import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from './ui/provider';
import { BrowserRouter } from 'react-router-dom';
import ChatProvider from "./Context/ChatProvider";
import { ChakraProvider } from '@chakra-ui/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <BrowserRouter>
      <ChatProvider>
        <Provider>
          <App />
        </Provider>
      </ChatProvider>
    </BrowserRouter>
  </ChakraProvider>
);
