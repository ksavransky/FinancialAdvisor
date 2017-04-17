import { connect } from 'react-redux';
import { Link } from 'react-router';
import RiskSelector from './risk_selector';

// Actions
// import { receiveTodos, receiveTodo } from '../../actions/todo_actions';
// import { allTodos } from '../../reducers/selectors';

const mapStateToProps = state => ({
  // todos: allTodos(state),
  // state
});

const mapDispatchToProps = dispatch => ({
  // receiveTodos: () => dispatch(receiveTodos()),
  // receiveTodo: todo => dispatch(receiveTodo(todo))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RiskSelector);
