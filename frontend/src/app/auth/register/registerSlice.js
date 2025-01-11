import { standardApiCall } from '@src/utils/api';

const REGISTER = 'app/auth/register/REGISTER'; // change to login to auto login?

export function register(username, email, password) {
  return standardApiCall('post', '/api/auth/register', { username, email, password }, REGISTER, {
    loadingComponent: ['AuthPopup', 'Register'],
    noticeOfSuccess: 'successfully created account! you can now sign in.',
  });
}
