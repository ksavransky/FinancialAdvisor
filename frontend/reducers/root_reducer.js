import { combineReducers } from 'redux';

import riskReducer from './risk_reducer.js';

const RootReducer = combineReducers({
  risk: riskReducer
});

export default RootReducer;
