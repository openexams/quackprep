import { standardApiCall } from '@utils/api';
import { createSelector } from 'reselect';
import getGroupsByUserId from '../groupSlice';

const GET_EXAMS = 'app/class/exam/GET_EXAMS';

export function getExamsByClassId(classId) {
  return standardApiCall('get', `/api/group/exam/${classId}`, null, GET_EXAMS, 'ExamList');
}

export function getExamsByUserId() {
  return getGroupsByUserId('exam', GET_EXAMS);
}

const DEFAULT_STATE = {
  exams: null,
};
export default function examSliceReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_EXAMS:
      return { ...state, exams: action.payload };
    default:
      return state;
  }
}

export const selectExamsState = createSelector(
  (state) => state,
  function (state) {
    return { exams: state.app.exam.exams };
  },
);
