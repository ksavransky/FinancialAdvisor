import { fetchRiskTable
       } from '../util/risk_table_api_util';

import { requestRiskTable,
         receiveRiskTable,
         RiskTableConstants
       } from '../actions/risk_table_actions.js';

export default ({getState, dispatch}) => next => action => {
 const riskTableSuccess = data => dispatch(receiveRiskTable(data));

 const result = next(action);
 switch(action.type){
   case RiskTableConstants.REQUEST_RISK_TABLE:
     fetchRiskTable(riskTableSuccess);
     break;
   default:
     next(action);
 }
 return result;
};
