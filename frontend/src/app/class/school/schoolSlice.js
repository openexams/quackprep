import { standardApiCall } from '@utils/api';
import { createSelector } from 'reselect';
import { updateArrWithNewVals } from '@utils/functions';

const GET_SCHOOLS = 'app/class/school/GET_SCHOOLS';

export function getSchools() {
  return standardApiCall('get', '/api/class/school/all', null, GET_SCHOOLS, 'SchoolsList');
}

const DEFAULT_STATE = {
  schools: null,
};
export default function schoolsReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_SCHOOLS:
      return { ...state, schools: updateArrWithNewVals(state.schools, action.payload) };
    default:
      return state;
  }
}

export const selectSchoolState = createSelector(
  (state) => state,
  function (state) {
    return { schools: state.app.school.schools };
  },
);
