import React from 'react';
import { Switch } from 'react-router-dom';
import Routes from './routes';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

function App() {
  return (
    <Switch>
      <Routes />
    </Switch>
  );
}

export default App;
