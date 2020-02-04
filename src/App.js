import React from 'react';
import './App.css';
import Form from './Components/Form';
import {CookiesProvider} from 'react-cookie';
function App() {
  return (
    <CookiesProvider>
      <div className="App">
        <h1>Colisweb Api</h1>
        <Form />
      </div>
    </CookiesProvider>
  );
}

export default App;
