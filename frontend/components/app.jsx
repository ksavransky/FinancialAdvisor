import React from 'react';
import { Link } from 'react-router';

const App = ({ children }) => (
  <div className="nav">
    <img id="top-logo" src="../../app/assets/images/home.ico"/>
    <div className="app-title">Financial Advisor</div>
    {children}
  </div>
);

export default App;
