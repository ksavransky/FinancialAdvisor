import { applyMiddleware } from 'redux';

import RiskMiddleware from '../middleware/risk_middleware';

const RootMiddleware = applyMiddleware(
  RiskMiddleware
);

export default RootMiddleware;
