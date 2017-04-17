import { combineReducers } from 'redux';

import riskReducer from './risk_reducer.js';
import riskTableReducer from './risk_table_reducer.js';

const RootReducer = combineReducers({
  risk: riskReducer,
  ristTable: riskTableReducer
});

export default RootReducer;
