import { standardApiCall } from '@utils/api';
import { updateArrWithNewVals } from '@utils/functions';
import { createSelector } from 'reselect';

const GET_QUESTIONS_BY_GROUPID = 'app/class/question/GET_QUESTIONS_BY_GROUPID';

export function getQuestionsByGroupId(group_id) {
  // TODO FIX
  return standardApiCall('get', `/api/question/${group_id}`, null, GET_QUESTIONS_BY_GROUPID, 'QuestionPage');
}

const DEFAULT_STATE = {
  questions: null,
};

export default function questionsReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_QUESTIONS_BY_GROUPID:
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
