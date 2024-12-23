import { standardApiCall } from '@src/utils/api';

const REGISTER = 'app/auth/register/REGISTER'; // change to login to auto login?

export function register(firstName, lastName, username, email, password) {
  return standardApiCall('post', '/api/auth/register', { firstName, lastName, username, email, password }, REGISTER, {
    loadingComponent: 'AuthPopup',
  });
}
