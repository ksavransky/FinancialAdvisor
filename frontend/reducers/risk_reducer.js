import {RiskConstants} from '../actions/risk_actions.js'
import merge from 'lodash/merge';

const riskReducer = function(state = {}, action){
  switch(action.type){
    case RiskConstants.RECEIVE_RISK:
      return action.risk;
    default:
      return state;
  }
};

export default riskReducer;
