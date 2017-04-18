import { connect } from 'react-redux';
import { Link } from 'react-router';
import RiskSelector from './risk_selector';

import { receiveRisk } from '../../actions/risk_actions';
import { riskReducer } from '../../reducers/risk_reducer';

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
)(RiskSelector);
