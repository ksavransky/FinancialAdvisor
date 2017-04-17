import { connect } from 'react-redux';
import { Link } from 'react-router';
import RiskSelector from './risk_selector';

// Actions
import { requestRisk, updateRisk } from '../../actions/risk_actions';
import { requestRiskTable } from '../../actions/risk_table_actions';
import { risk } from '../../reducers/risk_reducer';
import { riskTable } from '../../reducers/risk_table_reducer';

const mapStateToProps = state => ({
  risk: state.risk,
  riskTable: state.riskTable,
  state
});

const mapDispatchToProps = dispatch => ({
  requestRisk: () => dispatch(requestRisk()),
  updateRisk: (risk) => dispatch(updateRisk(risk)),
  requestRiskTable: () => dispatch(requestRiskTable()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RiskSelector);
