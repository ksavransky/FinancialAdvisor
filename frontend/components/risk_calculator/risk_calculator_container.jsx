import { connect } from 'react-redux';
import { Link } from 'react-router';
import RiskCalculator from './risk_calculator.jsx';

// Actions
import { receiveRisk } from '../../actions/risk_actions';
// import { receiveRiskTable } from '../../actions/risk_table_actions';
import { riskReducer } from '../../reducers/risk_reducer';
// import { riskTableReducer } from '../../reducers/risk_table_reducer';

const mapStateToProps = state => ({
  risk: state.risk,
  state
});

const mapDispatchToProps = dispatch => ({
  receiveRisk: (risk) => dispatch(receiveRisk(risk))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RiskCalculator);
