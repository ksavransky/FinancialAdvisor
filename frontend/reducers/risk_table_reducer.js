import {RiskTableConstants} from '../actions/risk_table_actions.js'
import merge from 'lodash/merge';

const riskTableReducer = function(state = {}, action){
  switch(action.type){
    case RiskTableConstants.RECEIVE_RISK_TABLE:
      return action.riskTable;
    default:
      return state;
  }
};

export default riskTableReducer;
