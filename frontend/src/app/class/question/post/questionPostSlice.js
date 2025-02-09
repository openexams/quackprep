import { createSelector } from '@reduxjs/toolkit';
import { standardApiCall } from '@utils/api';
import { upsertArray } from 'maddox-js-funcs';

const GET_QUESTION_POSTS = 'app/question/post/GET_QUESTION_POSTS';
const UPSERT_QUESTION_POST = 'app/question/post/UPSERT_QUESTION_POST';
const DELETE_QUESTION_POST = 'app/question/post/DELETE_QUESTION_POST';

export function getQuestionPostsByQuestionId(questionId) {
  return standardApiCall('get', `/api/question/post/${questionId}`, null, GET_QUESTION_POSTS, {
    loadingComponent: 'QuestionPostMain',

    errorMsg: 'failed to get question posts :(',
  });
}
/**
 *
 * @param {Number} id the id of post (should only be used for updating)
 * @param {Number} post_id the id of the parent post
 * @param {String} text the text of the post
 * @returns
 */

export function upsertQuestionPost(question_id, id, post_id, text) {
  return standardApiCall('post', `/api/question/post/`, { question_id, id, post_id, text }, UPSERT_QUESTION_POST, {
    loadingComponent: 'QuestionPostMain',

    errorMsg: 'failed to upsert question post :(',
  });
}

export function deleteQuestionPost(id) {
  return standardApiCall('delete', `/api/question/post/${id}`, null, DELETE_QUESTION_POST, {
    loadingComponent: 'QuestionPostMain',
    errorMsg: 'failed to delete question post :(',
  });
}

const DEFAULT_STATE = {
  questionPosts: null,
};

export default function questionPostReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_QUESTION_POSTS:
      return { ...state, questionPosts: [...(state.questionPosts || []), ...action.payload] }; // this assumes you hit each get route (for qposts) only once.
    case UPSERT_QUESTION_POST:
      return {
        ...state,
        questionPosts: upsertArray(state.questionPosts, action.payload).sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(), // sort largest value first in array
        ),
      };
    case DELETE_QUESTION_POST:
      return {
        ...state,
        questionPosts: state.questionPosts.map((qpost) => {
          if (qpost.id === parseInt(action.payload)) {
            return { ...qpost, text: null, deleted: 1 };
          } else {
            return qpost;
          }
        }),
      };
    default:
      return state;
  }
}

/**
 *
 * @param {number} questionId
 * @returns {import('../../../../../../types').QuestionPostSelect[]}
 */
export function selectQuestionPosts(questionId) {
  return createSelector(
    (state) => state.app.question.questionPosts.questionPosts,
    (questionPosts) => {
      if (Array.isArray(questionPosts)) {
        return questionPosts.filter((qpost) => qpost.question_id === parseInt(questionId));
      }
      return [];
    },
  );
}
