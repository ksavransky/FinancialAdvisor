export const RECEIVE_RISK = "RECEIVE_RISK";
export const UPDATE_RISK_PORTFOLIO = "UPDATE_RISK_PORTFOLIO";

export const receiveRisk = risk => ({
  type: RECEIVE_RISK,
  risk
});

export const updateRiskPortfolio = riskPortfolio => ({
  type: UPDATE_RISK_PORTFOLIO,
  riskPortfolio
});
