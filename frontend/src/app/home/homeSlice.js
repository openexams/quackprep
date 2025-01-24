import { standardApiCall } from '@utils/api';

const GET_USERS_COUNT = 'app/home/GET_USERS_COUNT';

export function getUserCount() {
  return standardApiCall('get', '/api/auth/users/count', null, GET_USERS_COUNT);
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

export const selectUserCount = (state) => {
  return { userCount: state.app.home.userCount };
};
