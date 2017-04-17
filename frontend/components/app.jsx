import React from 'react';
import { Link } from 'react-router';

const App = ({ children }) => (
  <div className="nac">
    <h1>Financial Advisor</h1>
    {children}
  </div>
);

export default App;
