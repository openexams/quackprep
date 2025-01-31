import { standardApiCall } from '@utils/api';
import { filterArr, upsertArray, countingSort, selectItemById, updateArrObjectsWithNewVals } from 'maddox-js-funcs';
import { GEN_AI_Q_AND_C_RES } from '../ai/aiQuestionSlice.js';
import { createSelector } from '@reduxjs/toolkit';

const GET_CRUD_CHOICES = 'app/class/question/choices/GET_CRUD_CHOICES';

const POST_FAVORITE_ANSWER = 'app/class/question/choices/POST_ANSWER_CURRENT';

const GET_CURRENT_CHOICES = 'app/class/question/choices/GET_CURRENT_CHOICES';
const UPSERT_CURRENT_CHOICE = 'app/class/question/choices/UPSERT_CURRENT_CHOICE';

const UPSERT_CRUD_CHOICE = 'app/class/question/choices/UPSERT_CRUD_CHOICE';

const DELETE_CRUD_CHOICE = 'app/class/question/choices/DELETE_CRUD_CHOICE';

export function getCurrentChoices() {
  return standardApiCall('get', '/api/choice/current/', null, GET_CURRENT_CHOICES);
}
export function removeStateCurrentChoices() {
  return { type: GET_CURRENT_CHOICES, payload: null };
}

// adds to answers_transactional and current
export function upsertCurrentChoiceAndPostAnswer(choice_id, question_id, text = null) {
  return standardApiCall('post', `/api/choice/answer/`, { choice_id, question_id, text }, UPSERT_CURRENT_CHOICE, {
    loadingComponent: ['FRQAnswer'],
  });
}

export function postFavoriteAnswer(choice_id) {
  return standardApiCall('post', `/api/choice/favorite/${choice_id}`, {}, POST_FAVORITE_ANSWER);
}

export function getChoicesByQuestion(question_id) {
  return standardApiCall('get', `/api/choice/${question_id}`, null, GET_CRUD_CHOICES, { loadingComponent: 'ChoiceRouter' });
}

export function getChoicesByGroup(group_id) {
  return standardApiCall('get', `/api/choice/group/${group_id}`, null, GET_CRUD_CHOICES, { loadingComponent: 'ChoiceRouter' }); //yes I know its same does not matter
}

// export function getChoicesByUserId() {
//   return standardApiCall('get', `/api/choice/user`, null, GET_CRUD_CHOICES, { loadingComponent: 'Create' }); //yes I know its same does not matter
// }

export function upsertChoice(text, question_id, isCorrect, type, id = null) {
  return standardApiCall('post', `/api/choice/${question_id}`, { text, isCorrect, type, id }, UPSERT_CRUD_CHOICE, {
    loadingComponent: 'ChoiceRouter',
    noticeOfSuccess: 'successfully created choice!',
  });
}

export function deleteChoiceById(id) {
  return standardApiCall('delete', `/api/choice/${id}`, null, DELETE_CRUD_CHOICE, {
    loadingComponent: 'ChoiceRouter',
    noticeOfSuccess: 'successfully deleted choice!',
  });
}

export function checkStudentFRQAnswer(trans_id, question_text, student_answer_text, correct_answer_text) {
  return standardApiCall(
    'post',
    '/api/ai/choice/grade/',
    {
      trans_id,
      question_text,
      student_answer_text,
      correct_answer_text,
    },
    UPSERT_CURRENT_CHOICE, // it upserts a current choice so use same thing!
    { loadingComponent: ['AiGrade'], noticeOfSuccess: 'successfully ai graded answer' },
  );
}

const DEFAULT_STATE = {
  choices: null,
  currentChoices: null,
};

export default function choicesReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_CRUD_CHOICES: {
      return {
        ...state,
        choices: countingSort(
          updateArrObjectsWithNewVals([...(state.choices || [])], [...action.payload], 'question_id'),
          'question_id',
        ),
      };
    }
    case DELETE_CRUD_CHOICE:
      return { ...state, choices: filterArr(state.choices, action.payload) };
    case UPSERT_CRUD_CHOICE:
      return { ...state, choices: countingSort(upsertArray(state.choices, action.payload), 'question_id') };
    case GEN_AI_Q_AND_C_RES: {
      /**@type {import("../../../../../../shared-types/choice.types").GenQuestion} */
      const generatedChoices = action.payload?.choices;
      return { ...state, choices: countingSort(updateArrObjectsWithNewVals(state.choices, generatedChoices), 'question_id') }; // shouldnt have to counting sort them because they are new
    }

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

export const selectCurrentChoicesState = createSelector(
  (state) => state,
  (state) => state.app.choices.currentChoices,
);
