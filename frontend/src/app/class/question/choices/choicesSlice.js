import { standardApiCall } from '@utils/api';
import { updateArrObjectsWithNewVals, filterArr, upsertArray } from '@utils/functions';
import { createSelector } from 'reselect';
import { countingSort, mergeData } from '../../../../../../shared/globalFuncs';

const GET_CRUD_CHOICES = 'app/class/question/choices/GET_CRUD_CHOICES';

const POST_ANSWER = 'app/class/question/choices/POST_ANSWER';
const POST_FAVORITE_ANSWER = 'app/class/question/choices/POST_ANSWER_CURRENT';

const GET_CURRENT_CHOICES = 'app/class/question/choices/POST_ANSWER_CURRENT';

const UPSERT_CRUD_CHOICE = 'app/class/question/choices/UPSERT_CRUD_CHOICE';

const DELETE_CRUD_CHOICE = 'app/class/question/choices/DELETE_CRUD_CHOICE';

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
  return standardApiCall('get', `/api/choice/${question_id}`, null, GET_CRUD_CHOICES, 'ChoiceRouter');
}

export function getChoicesByGroup(group_id) {
  return standardApiCall('get', `/api/choice/group/${group_id}`, null, GET_CRUD_CHOICES, 'ChoiceRouter'); //yes I know its same does not matter
}

export function getChoicesByUserId() {
  return standardApiCall('get', `/api/choice/user`, null, GET_CRUD_CHOICES, 'Create'); //yes I know its same does not matter
}

export function upsertChoice(text, question_id, isCorrect, type, id = null) {
  return standardApiCall('post', `/api/choice/${question_id}`, { text, isCorrect, type, id }, UPSERT_CRUD_CHOICE, 'Create');
}

export function deleteChoiceById(id) {
  return standardApiCall('delete', `/api/choice/${id}`, null, DELETE_CRUD_CHOICE, 'Create');
}

const DEFAULT_STATE = {
  choices: null,
};

export default function choicesReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_CRUD_CHOICES: {
      // all choices only map to 1 question & the api will only call this route once so i can just append to the array and dont have to check for duplicates
      return {
        ...state,
        choices: mergeData(countingSort([...(state.choices || []), ...action.payload], 'id')),
      };
    }
    case DELETE_CRUD_CHOICE:
      return { ...state, choices: filterArr(state.choices, action.payload) };
    case UPSERT_CRUD_CHOICE: // if inserteing new id will be higher than all others
      return { ...state, choices: mergeData(upsertArray(state.choices, action.payload)) }; // becuz upsert arr adds new item to end i dont need to sort it again
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
