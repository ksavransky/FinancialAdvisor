export const RECEIVE_RISK = "RECEIVE_RISK";
export const UPDATE_RISK_PORTFOLIO = "UPDATE_RISK_PORTFOLIO";
export const REQUEST_RISK_TABLE = "REQUEST_RISK_TABLE";
export const RECEIVE_RISK_TABLE = "RECEIVE_RISK_TABLE";

export const receiveRisk = risk => ({
  type: RECEIVE_RISK,
  risk
});

export const receiveRiskTable = riskTable => ({
  type: RECEIVE_RISK_TABLE,
  riskTable
});

export const requestRiskTable = () => ({
  type: REQUEST_RISK_TABLE
});

export const updateRiskPortfolio = riskPortfolio => ({
  type: UPDATE_RISK_PORTFOLIO,
  riskPortfolio
});
