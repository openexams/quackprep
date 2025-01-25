import { standardApiCall } from '@utils/api';
import { selectBinaryItemById, selectItemById, updateArrObjectsWithNewVals } from 'maddox-js-funcs';
import { selectClassState } from '../classSlice';

const GET_SCHOOLS = 'app/class/school/GET_SCHOOLS';

export function getSchools() {
  return standardApiCall('get', '/api/class/school/all', null, GET_SCHOOLS, { loadingComponent: 'SchoolsList' });
}

export function getSchoolByClassId(classId) {
  return function (dispatch, getState) {
    const curClass = selectItemById(selectClassState(getState()).classes, 'id', classId);
    const school_id = curClass.school_id;
    const school = selectItemById(selectSchoolState(getState()).schools, 'id', school_id);
    console.log(school);
    return school;
  };
}

const DEFAULT_STATE = {
  schools: null,
};
export default function schoolsReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_SCHOOLS:
      return { ...state, schools: updateArrObjectsWithNewVals(state.schools, action.payload) };
    default:
      return state;
  }
}

export const selectSchoolState = (state) => {
  return { schools: state.app.school.schools };
};
