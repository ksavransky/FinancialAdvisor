import React from 'react';
import { Provider } from 'react-redux';

import { IndexRoute, hashHistory, Redirect } from 'react-router';
import { HashRouter as Router, Route } from 'react-router-dom';

import App from './app';

import RiskSelectorContainer from './risk_selector/risk_selector_container.jsx';
import RiskCalcContainer from './risk_calculator/risk_calc_container.jsx';



const Root = ({ store }) => {

  return (
    <Provider store={store}>
      <Router>
         <div className="react-root">
          <Route path="/" component={App}></Route>
          <Route exact path="/" render={() => (
              <Redirect to="/home"/>
          )}/>
          <Route path="/home" component={RiskSelectorContainer}></Route>
          <Route path="/calculator" component={RiskCalcContainer}></Route>
         </div>
      </Router>
    </Provider>
  );
};

export default Root;
