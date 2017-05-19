import React from 'react';
import { Link } from 'react-router';

const App = ({ children }) => (
  <header>
    <img id="top-logo" src="../../app/assets/images/home.ico"/>
    <div id="app-title">Financial Advisor</div>
    {children}
  </header>
);

export default App;
