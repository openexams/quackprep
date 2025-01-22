import { standardApiCall } from '@src/utils/api';
import { LOGIN } from './login/loginSlice';
import { selectItemById } from 'maddox-js-funcs';
import { ADMIN_ACCOUNT_ID } from '../../../../constants.js';

export function getCurUser() {
  return standardApiCall('get', '/api/auth/verify', null, LOGIN, { loadingComponent: 'AuthPopup' });
}

export const selectUser = (state) => {
  return { user: state.auth.user };
};

/**
 * if ur in a current class use this.
 * @returns
 */
export function selectCanAndIsEdit() {
  // wont work for class view as this needs a class id
  return (state) => {
    if (state.app.navbar.editing === true) {
      const curClass = selectItemById(state.app.class.classes.classes, 'id', state.app.navbar.classId);
      if (!curClass) {
        return false;
      }
      if (parseInt(curClass.created_by) === parseInt(state.auth.user?.id) || parseInt(state.auth.user?.id) === ADMIN_ACCOUNT_ID) {
        return true;
      }
    }
    return false;
  };
}

export function selectEditState(state) {
  return state.app.navbar.editing;
}
