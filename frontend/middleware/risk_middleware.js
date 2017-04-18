// import { fetchRisk,
//          refreshRisk
//        } from '../util/risk_api_util';
//
// import { requestRisk,
//          receiveRisk,
//          updateRisk,
//          RiskConstants
//        } from '../actions/risk_actions.js';
//
// export default ({getState, dispatch}) => next => action => {
//  const riskSuccess = data => dispatch(receiveRisk(data));
//
//  const updateCallback = risk => {
//    dispatch(receiveRisk(risk));
//  };
//
//  const result = next(action);
//  switch(action.type){
//    case RiskConstants.REQUEST_RISK:
//      fetchRisk(riskSuccess);
//      break;
//    case RiskConstants.UPDATE_RISK:
//      refreshRisk(risk, updateCallback);
//      break;
//    default:
//      next(action);
//  }
//  return result;
// };
