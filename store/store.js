import { combineReducers, applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import axios from 'axios';

const userInitialState = {
  user: '',
};
//action type
const USER_LOGOUT = 'USER_LOGOUT';

//action creators
export function logout() {
  return (dispatch) => {
    axios
      .post('/logout')
      .then((resp) => {
        if (resp.status === 200) {
          dispatch({
            type: USER_LOGOUT,
          });
        } else {
          console.log('logout fail', resp);
        }
      })
      .catch((err) => {
        console.log('logout function error', err);
      });
  };
}

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case USER_LOGOUT:
      return {};
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
