import { standardApiCall } from '@utils/api';
import { filterArr, upsertArray, countingSort, mergeData, selectItemById } from 'maddox-js-funcs';
import { createSelector } from 'reselect';

const GET_CRUD_CHOICES = 'app/class/question/choices/GET_CRUD_CHOICES';

const POST_ANSWER = 'app/class/question/choices/POST_ANSWER';
const POST_FAVORITE_ANSWER = 'app/class/question/choices/POST_ANSWER_CURRENT';

const GET_CURRENT_CHOICES = 'app/class/question/choices/GET_CURRENT_CHOICES';
const UPSERT_CURRENT_CHOICE = 'app/class/question/choices/UPSERT_CURRENT_CHOICE';

const UPSERT_CRUD_CHOICE = 'app/class/question/choices/UPSERT_CRUD_CHOICE';

const DELETE_CRUD_CHOICE = 'app/class/question/choices/DELETE_CRUD_CHOICE';

export function getCurrentChoices() {
  return standardApiCall('get', '/api/choice/current/', null, GET_CURRENT_CHOICES, null);
}
export function removeStateCurrentChoices() {
  return { type: GET_CURRENT_CHOICES, payload: null };
}

export function upsertCurrentChoice(choice_id, question_id) {
  return standardApiCall('post', `/api/choice/current/`, { choice_id, question_id }, UPSERT_CURRENT_CHOICE);
}

export function postFavoriteAnswer(choice_id) {
  return standardApiCall('post', `/api/choice/favorite/${choice_id}`, {}, POST_FAVORITE_ANSWER);
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
  return standardApiCall(
    'post',
    `/api/choice/${question_id}`,
    { text, isCorrect, type, id },
    UPSERT_CRUD_CHOICE,
    'Create',
    null,
    null,
    'successfully upserted choice!',
  );
}

export function deleteChoiceById(id) {
  return standardApiCall(
    'delete',
    `/api/choice/${id}`,
    null,
    DELETE_CRUD_CHOICE,
    'Create',
    null,
    null,
    'successfully deleted choice!',
  );
}

const DEFAULT_STATE = {
  choices: null,
  currentChoices: null,
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
      return { ...state, choices: upsertArray(state.choices, ...mergeData(action.payload)) }; // becuz upsert arr adds new item to end i dont need to sort it again

    case GET_CURRENT_CHOICES:
      return { ...state, currentChoices: action.payload };
    case UPSERT_CURRENT_CHOICE:
      return { ...state, currentChoices: upsertArray(state.currentChoices, action.payload) };
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
// only choice pulled in should be from cur user.
export function doesQuestionHaveCurrentChoice(currentChoices, question_id) {
  const choice = selectItemById(currentChoices, 'question_id', question_id);
  if (!choice) {
    return null;
  }
  if (choice.is_correct) {
    return true;
  } else if (choice.is_correct === 0) {
    return false;
  } else {
    return null;
  }
}
export function selectCurrentChoicesState(state) {
  return state.app.choices.currentChoices;
}
