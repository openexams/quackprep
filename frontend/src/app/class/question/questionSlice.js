import { standardApiCall } from '@utils/api';
import { updateArrWithNewVals } from '@utils/functions';
import { createSelector } from 'reselect';

const GET_QUESTIONS = 'app/class/question/GET_QUESTIONS';

export function getQuestionsByGroupId(group_id, type) {
  return standardApiCall('get', `/api/question/${group_id}`, null, GET_QUESTIONS, 'QuestionPage');
}

export function getQuestionsByUserId() {
  return standardApiCall('get', `/api/question/user`, null, GET_QUESTIONS, 'Create');
}

const DEFAULT_STATE = {
  questions: null,
};

export default function questionsReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_QUESTIONS:
      return { ...state, questions: updateArrWithNewVals(state.questions, action.payload) };
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
