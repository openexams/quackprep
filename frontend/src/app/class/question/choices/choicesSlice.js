import { standardApiCall } from '@utils/api';
import { updateArrWithNewVals } from '@utils/functions';
import { createSelector } from 'reselect';

const GET_CHOICES = 'app/class/question/choices/GET_CHOICES';

const POST_ANSWER = 'app/class/question/choices/POST_ANSWER';
const POST_FAVORITE_ANSWER = 'app/class/question/choices/POST_ANSWER_CURRENT';

const GET_CURRENT_CHOICES = 'app/class/question/choices/POST_ANSWER_CURRENT';

//TODO
export function getCurrentChoices(user_id) {
  if (user_id === null) {
    return;
  }
  return standardApiCall('get', '/api/choice/current', null, GET_CURRENT_CHOICES, 'ChoiceRouter');
}

// not used right now needs to be used and setup. TODO
export function postFavoriteAnswer(choice_id) {
  return standardApiCall('post', `/api/choice/favorite/${choice_id}`, {}, POST_FAVORITE_ANSWER);
}

//TODO
export function upsertCurrentAnswer(choice_id, question_id) {
  return standardApiCall('post', `/api/choice/${choice_id}/${question_id}`, {}, null);
}

export function postAnswer(choice_id) {
  return standardApiCall('post', `/api/choice/answer/${choice_id}`, {}, null);
}

export function getChoicesByQuestion(question_id) {
  return standardApiCall('get', `/api/choice/${question_id}`, null, GET_CHOICES, 'ChoiceRouter');
}

export function getChoicesByGroup(group_id) {
  return standardApiCall('get', `/api/choice/group/${group_id}`, null, GET_CHOICES, 'ChoiceRouter'); //yes I know its same does not matter
}

export function getChoicesByUserId() {
  return standardApiCall('get', `/api/choice/user`, null, GET_CHOICES, 'Create'); //yes I know its same does not matter
}

const DEFAULT_STATE = {
  choices: null,
};

export default function choicesReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_CHOICES:
      return { ...state, choices: updateArrWithNewVals(state.choices, action.payload) };
    default:
      return state;
  }
}

export const selectChoicesState = createSelector(
  (state) => state,
  function (state) {
    return { choices: state.app.choices.choices };
  },
);
