import { standardApiCall } from '@utils/api';
import { updateArrObjectsWithNewVals } from '@utils/functions';
import { createSelector } from 'reselect';

const GET_QUESTIONS = 'app/class/question/GET_QUESTIONS';
const UPSERT_QUESTION = 'app/class/question/UPSERT_QUESTION';
const DELETE_QUESTION = 'app/class/question/DELETE_QUESTION';

export function getQuestionsByGroupId(group_id) {
  return standardApiCall('get', `/api/question/${group_id}`, null, GET_QUESTIONS, 'QuestionPage');
}

export function getQuestionsByUserId() {
  return standardApiCall('get', `/api/question/user`, null, GET_QUESTIONS, 'Create');
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
  return standardApiCall('post', `/api/question/`, { id, question, question_num_on_exam, group_ids }, UPSERT_QUESTION, 'Create');
}

export function deleteQuestionById(id) {
  return standardApiCall('delete', `/api/question/${id}`, null, DELETE_QUESTION, 'Create');
}

const DEFAULT_STATE = {
  questions: null,
};

export default function questionsReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_QUESTIONS:
      return { ...state, questions: updateArrObjectsWithNewVals(state.questions, action.payload) };
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
