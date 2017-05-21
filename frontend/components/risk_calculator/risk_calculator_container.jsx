import { connect } from 'react-redux';
import { Link } from 'react-router';
import RiskCalculator from './risk_calculator.jsx';

import { receiveRisk } from '../../actions/risk_actions';
import { updateRiskPortfolio } from '../../actions/risk_actions';
import { riskReducer } from '../../reducers/risk_reducer';

const mapStateToProps = state => ({
  riskState: state.risk,
  state
});

const mapDispatchToProps = dispatch => ({
  receiveRisk: (risk) => dispatch(receiveRisk(risk)),
  updateRiskPortfolio: (riskPortfolio) => dispatch(updateRiskPortfolio(riskPortfolio))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RiskCalculator);
