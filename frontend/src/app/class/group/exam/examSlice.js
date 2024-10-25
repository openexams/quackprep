import { standardApiCall } from '@utils/api';
import { createSelector } from 'reselect';

const GET_EXAMS_BY_CLASS_ID = 'app/class/exam/GET_EXAMS_BY_CLASS_ID';

export function getExamsByClassId(classId) {
  return standardApiCall('get', `/api/group/exam/${classId}`, null, GET_EXAMS_BY_CLASS_ID, 'ExamList');
}
const DEFAULT_STATE = {
  exams: null,
};
export default function examSliceReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_EXAMS_BY_CLASS_ID:
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
