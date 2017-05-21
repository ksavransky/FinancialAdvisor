import { RECEIVE_RISK } from '../actions/risk_actions';
import { UPDATE_RISK_PORTFOLIO } from '../actions/risk_actions';
import merge from 'lodash/merge';

const riskReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState;

  switch(action.type){
    case RECEIVE_RISK:
      nextState = {"risk": action.risk }
      return nextState;
    case UPDATE_RISK_PORTFOLIO:
      nextState = merge({}, state);
      nextState.risk.portfolio = action.riskPortfolio;
      return nextState;
    default:
      return state;
  }
};

export default riskReducer;
