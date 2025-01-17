import { standardApiCall } from '@src/utils/api';
import { LOGIN } from './login/loginSlice';

export function getCurUser() {
  return standardApiCall('get', '/api/auth/verify', null, LOGIN, { loadingComponent: 'AuthPopup' });
}

export const selectUser = (state) => {
  return { user: state.auth.user };
};

export function selectCanAndIsEdit(user_id) {
  return (state) => {
    if (!user_id) {
      console.error('didnt pass in user_id');
      return false;
    }
    if (state.app.navbar.editing === true) {
      if (state.auth.user?.id === parseInt(user_id)) {
        return true;
      }
    }
    return false;
  };
}

export function selectEditState(state) {
  return state.app.navbar.editing;
}
