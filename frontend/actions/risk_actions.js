export const RiskConstants = {
  REQUEST_RISK_TABLE: "REQUEST_RISK_TABLE",
  REQUEST_RISK: "REQUEST_RISK",
  RECEIVE_RISK_TABLE: "RECEIVE_RISK_TABLE",
  RECEIVE_RISK: "RECEIVE_RISK",
  UPDATE_RISK: "UPDATE_RISK"
};

export const requestRiskTable = () => ({
  type: RiskConstants.REQUEST_RISK_TABLE
});

export const requestRisk = () => ({
  type: RiskConstants.REQUEST_RISK
});

export const receiveRiskTable = riskTable => ({
  type: RiskConstants.RECEIVE_USERS,
  riskTable
});

export const receiveRisk = risk => ({
  type: RiskConstants.RECEIVE_RISK,
  risk
});

export const updateRisk = risk => ({
  type: RiskConstants.UPDATE_RISK,
  risk
});
