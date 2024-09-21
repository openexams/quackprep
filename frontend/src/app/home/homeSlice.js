import { standardApiCall } from '@src/utils/api';
import { createSelector } from 'reselect';

const GET_USERS_COUNT = 'app/home/GET_USERS_COUNT';

export function getUserCount() {
  return standardApiCall('get', '/api/auth/users/count', null, GET_USERS_COUNT, 'home', null, null);
}
const DEFAULT_STATE = {
  userCount: null,
};
export default function homeReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_USERS_COUNT:
      return { ...state, userCount: action.payload };
    default:
      return state;
  }
}

export const selectHomeState = createSelector(
  (state) => state,
  function (state) {
    return { userCount: state.app.home.userCount };
  },
);
