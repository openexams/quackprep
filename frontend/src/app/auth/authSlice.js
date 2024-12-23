import { standardApiCall } from '@src/utils/api';
import { LOGIN } from './login/loginSlice';

export function getCurUser() {
  return standardApiCall('get', '/api/auth/verify', null, LOGIN, { loadingComponent: 'AuthPopup' });
}

export const selectUser = (state) => {
  return { user: state.auth.user };
};
