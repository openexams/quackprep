import { standardApiCall } from '@utils/api';
import { upsertArray } from 'maddox-js-funcs';

const GET_FAVORITE_QUESTIONS = 'app/favorite/GET_FAVORITE_QUESTIONS';
const UPSERT_FAVORITE_QUESTION = 'app/favorite/UPSERT_FAVORITE_QUESTION';

export function removeStateFavoriteQuestions() {
  return { type: GET_FAVORITE_QUESTIONS, payload: null };
}

// must be LOGGED IN TODO I REMOVED fetchHistory so may not work
export function getFavoriteQuestions() {
  return standardApiCall('get', '/api/question/favorite/', null, GET_FAVORITE_QUESTIONS, { loadingComponent: 'QuestionPage' });
}

export function upsertFavoriteQuestion(id, question_id, is_favorite) {
  return standardApiCall('post', '/api/question/favorite/', { id, question_id, is_favorite }, UPSERT_FAVORITE_QUESTION);
}

////////////////////

const DEFAULT_STATE = {
  favoriteQuestions: null,
};

export default function favoriteReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_FAVORITE_QUESTIONS:
      return {
        ...state,
        favoriteQuestions: action.payload,
      };
    case UPSERT_FAVORITE_QUESTION:
      return {
        ...state,
        favoriteQuestions: upsertArray(state.favoriteQuestions, action.payload),
      };
    default:
      return state;
  }
}

export function selectFavoriteQuestionsState(state) {
  return state.app.favorites.favoriteQuestions;
}

export function isFavoriteQuestion(questions, questionId) {
  if (!Array.isArray(questions) || !questionId) return false;
  for (let i = 0; i < questions.length; i++) {
    if (questions[i]?.question_id === parseInt(questionId)) {
      if (questions[i]?.is_favorite === 1) {
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
}
