import { connect } from 'react-redux';
import { Link } from 'react-router';
import RiskSelector from './risk_selector.jsx';

import { requestRiskTable, receiveRisk} from '../../actions/risk_actions';
import { riskReducer } from '../../reducers/risk_reducer';

const mapStateToProps = state => ({
  riskState: state.risk,
  state
});

const mapDispatchToProps = dispatch => ({
  receiveRisk: (risk) => dispatch(receiveRisk(risk)),
  requestRiskTable: () => dispatch(requestRiskTable())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RiskSelector);
