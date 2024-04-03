import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { client } from './apollo/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { SessionProvider } from './context/SessionContext';
import Footer from './components/Footer/Footer';

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <SessionProvider>
        <App />
        <Footer />
      </SessionProvider>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
