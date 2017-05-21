import { fetchRiskTable } from '../util/risk_api_util';

import { REQUEST_RISK_TABLE } from '../actions/risk_actions';
import { receiveRiskTable } from '../actions/risk_actions';

export default ({getState, dispatch}) => next => action => {
 const riskTableSuccess = table => dispatch(receiveRiskTable(table));

 const result = next(action);
 switch(action.type){
   case REQUEST_RISK_TABLE:
     fetchRiskTable(riskTableSuccess);
     break;
   default:
     next(action);
 }
 return result;
};
