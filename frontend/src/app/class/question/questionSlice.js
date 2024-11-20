import { standardApiCall } from '@utils/api';
import { updateArrObjectsWithNewVals, upsertArray, filterArr } from '@utils/functions';
import { createSelector } from 'reselect';

const GET_CRUD_QUESTIONS = 'app/class/question/GET_CRUD_QUESTIONS';
const UPSERT_CRUD_QUESTION = 'app/class/question/UPSERT_CRUD_QUESTION';
const DELETE_CRUD_QUESTION = 'app/class/question/DELETE_CRUD_QUESTION';

const POST_QUESTION_REPORT = 'app/class/question/POST_QUESTION_REPORT';

export function postQuestionReport(question_id, text) {
  return standardApiCall(
    'post',
    `/api/question/report/${question_id}`,
    { text: text },
    POST_QUESTION_REPORT,
    'QuestionPage',
    null,
    null,
    'report sent!',
  );
}

export function getQuestionsByGroupId(group_id) {
  return standardApiCall('get', `/api/question/${group_id}`, null, GET_CRUD_QUESTIONS, 'QuestionPage');
}

export function getQuestionsByUserId() {
  return standardApiCall('get', `/api/question/user`, null, GET_CRUD_QUESTIONS, 'Create');
}

/**
 *
 * @param {Int} id
 * @param {String} question
 * @param {Int} question_num_on_exam
 * @param {Array} group_ids
 * @returns
 */
export function upsertQuestionWithGroupIds(id, question, question_num_on_exam, group_ids) {
  return standardApiCall(
    'post',
    `/api/question/`,
    { id, question, question_num_on_exam, group_ids },
    UPSERT_CRUD_QUESTION,
    'Create',
  );
}

export function deleteQuestionById(id) {
  return standardApiCall('delete', `/api/question/${id}`, null, DELETE_CRUD_QUESTION, 'Create');
}

const DEFAULT_STATE = {
  questions: null,
};

export default function questionsReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_CRUD_QUESTIONS:
      return { ...state, questions: updateArrObjectsWithNewVals(state.questions, action.payload) };
    case DELETE_CRUD_QUESTION:
      return { ...state, questions: filterArr(state.questions, action.payload) };
    case UPSERT_CRUD_QUESTION:
      return { ...state, questions: upsertArray(state.questions, action.payload?.[0]) };
    default:
      return state;
  }
}

export const selectQuestionState = createSelector(
  (state) => state,
  function (state) {
    return { questions: state.app.question.questions };
  },
);
