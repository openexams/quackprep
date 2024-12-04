import { standardApiCall } from '@utils/api';
import { createSelector } from 'reselect';
import { deleteGroupById, getGroupsByUserId, upsertGroup } from '../groupSlice';
import { updateArrObjectsWithNewVals, filterArr, upsertArray, countingSort } from 'maddox-js-funcs.js';

const GET_CRUD_EXAMS = 'app/class/exam/GET_CRUD_EXAMS';
const DELETE_CRUD_EXAM = 'app/class/exam/DELETE_CRUD_EXAM';
const UPSERT_CRUD_EXAM = 'app/class/exam/UPSERT_CRUD_EXAM';

export function getExamsByClassId(classId) {
  return standardApiCall('get', `/api/group/exam/${classId}`, null, GET_CRUD_EXAMS, 'ExamList');
}

export function getExamsByUserId() {
  return getGroupsByUserId('exam', GET_CRUD_EXAMS);
}

export function deleteExamById(id) {
  return deleteGroupById(id, DELETE_CRUD_EXAM); //TODO
}

export function upsertExam(id, name, class_id, desc) {
  return upsertGroup(id, name, class_id, 'exam', desc, UPSERT_CRUD_EXAM);
}

const DEFAULT_STATE = {
  exams: null,
};
export default function examSliceReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_CRUD_EXAMS:
      return {
        ...state,
        exams: countingSort(updateArrObjectsWithNewVals(state.exams, action.payload), 'class_id'),
      };
    case DELETE_CRUD_EXAM:
      return { ...state, exams: filterArr(state.exams, action.payload) };
    case UPSERT_CRUD_EXAM:
      return { ...state, exams: upsertArray(state.exams, action.payload?.[0]) };
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
