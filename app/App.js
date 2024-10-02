
"use client";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { UserProvider } from './crud/UserContext'; // Importez le UserProvider

ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById('root')
);
