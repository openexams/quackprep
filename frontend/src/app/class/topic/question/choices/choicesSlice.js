import { standardApiCall } from '@utils/api';
import { updateArrWithNewVals } from '@utils/functions';

const GET_CHOICES_BY_Q = 'app/class/topic/question/choices/GET_CHOICES_BY_Q';

const POST_ANSWER = 'app/class/topic/question/choices/POST_ANSWER';
const POST_FAVORITE_ANSWER = 'app/class/topic/question/choices/POST_ANSWER_CURRENT';

const GET_CURRENT_CHOICES = 'app/class/topic/question/choices/POST_ANSWER_CURRENT';

//TODO
export function getCurrentChoices(user_id) {
  if (user_id === null) {
    return;
  }
  return standardApiCall('get', '/api/answer/current', null, GET_CURRENT_CHOICES, 'QuestionChoices');
}

// not used right now needs to be used and setup.
export function postFavoriteAnswer(choice_id) {
  return standardApiCall('post', `/api/answer/favorite/${choice_id}`, {}, POST_FAVORITE_ANSWER);
}

export function upsertCurrentAnswer(choice_id, question_id) {
  return standardApiCall('post', `/api/answer/${choice_id}/${question_id}`, {}, null);
}

export function postAnswer(choice_id) {
  return standardApiCall('post', `/api/answer/${choice_id}`, {}, null);
}

export function getChoicesByQuestion(question_id) {
  return standardApiCall('get', `/api/answer/${question_id}`, null, GET_CHOICES_BY_Q, 'QuestionChoices');
}

const DEFAULT_STATE = {
  choices: null,
};

export default function choicesReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_CHOICES_BY_Q:
      return { ...state, choices: updateArrWithNewVals(state.choices, action.payload) };
    default:
      return state;
  }
}
