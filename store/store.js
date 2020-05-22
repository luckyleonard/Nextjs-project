import { combineReducers, applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const userInitialState = {
  username: '',
};

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

const allReducers = combineReducers({
  user: userReducer,
});

export default function initializeStore(state) {
  //默认导出的是一个创建新的store对象的方法
  const store = createStore(
    allReducers,
    Object.assign({}, { user: userInitialState }, state),
    composeWithDevTools(applyMiddleware(ReduxThunk))
  );

  return store;
}
