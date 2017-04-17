export const RiskTableConstants = {
  REQUEST_RISK_TABLE: "REQUEST_RISK_TABLE",
  RECEIVE_RISK_TABLE: "RECEIVE_RISK_TABLE"
};

export const requestRiskTable = (riskTable) => ({
  type: RiskTableConstants.REQUEST_RISK_TABLE,
  riskTable
});

export const receiveRiskTable = riskTable => ({
  type: RiskTableConstants.RECEIVE_USERS,
  riskTable
});
