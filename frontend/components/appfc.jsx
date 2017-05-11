import React from 'react';
import { Link } from 'react-router';

const AppFC = ({ children }) => (
  <div className="nav">
    <div className="app-title">Financial Advisor</div>
    {children}
  </div>
);

export default AppFC;
