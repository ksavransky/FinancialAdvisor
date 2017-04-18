import React from 'react';
import { Provider } from 'react-redux';

// react router
import { IndexRoute, hashHistory } from 'react-router';
import { HashRouter as Router, Route } from 'react-router-dom';

// react components
import App from './app';

import ToDoListContainer from './todo_list/todo_list_container.jsx';
import StepListContainer from './step_list/step_list_container.jsx';
import RiskSelectorContainer from './risk_selector/risk_selector_container.jsx';


const Root = ({ store }) => {

  return (
    <Provider store={store}>
      <Router>
         <div className="react-root">
          <Route path="/" component={App}></Route>
          <Route path="/risk" component={RiskSelectorContainer}></Route>
         </div>
      </Router>
    </Provider>
  );
};

export default Root;
