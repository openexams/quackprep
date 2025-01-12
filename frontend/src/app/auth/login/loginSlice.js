import { standardApiCall } from '@src/utils/api';

export const LOGIN = 'app/auth/login/LOGIN';

const SIGN_OUT = 'app/auth/login/SIGN_OUT';

export function signOut() {
  return standardApiCall('post', '/api/auth/signout', {}, SIGN_OUT);
}

export function login(email, password) {
  return standardApiCall('post', '/api/auth/login', { email, password }, LOGIN, {
    loadingComponent: ['AuthPopup', 'Login'],
    noticeOfSuccess: 'successfully logged in!',
  });
}

const DEFAULT_STATE = {
  id: null,
  username: null,
  email: null,
  firstName: null,
  lastName: null,
  icon: null,
  is_creator: null,
};
export default function loginReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case LOGIN: {
      const { id, username, email, first_name, last_name, icon, is_creator } = action.payload;
      if (!id || !username || !email) {
        return state;
      }
      return { ...state, id, username, email, firstName: first_name, lastName: last_name, icon, is_creator };
    }
    case SIGN_OUT:
      return {
        ...state,
        id: DEFAULT_STATE.id,
        username: DEFAULT_STATE.username,
        email: DEFAULT_STATE.email,
        firstName: DEFAULT_STATE.first_name,
        lastName: DEFAULT_STATE.last_name,
        icon: DEFAULT_STATE.icon,
        is_creator: DEFAULT_STATE.is_creator,
      };
    default:
      return state;
  }
}
