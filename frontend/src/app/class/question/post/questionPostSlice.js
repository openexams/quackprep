import { createSelector } from '@reduxjs/toolkit';
import { standardApiCall } from '@utils/api';

const GET_QUESTION_POSTS_BY_QUESTION_ID = 'app/question/post/GET_QUESTION_POSTS_BY_QUESTION_ID';
export function getQuestionPostsByQuestionId(questionId) {
  return standardApiCall('get', `/api/question/post/${questionId}`, null, GET_QUESTION_POSTS_BY_QUESTION_ID, {
    loadingComponent: 'QuestionPage',
    errorMsg: 'failed to get question posts :(',
  });
}

const DEFAULT_STATE = {
  questionPosts: null,
};

export default function questionPostReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_QUESTION_POSTS_BY_QUESTION_ID:
      return { ...state, questionPosts: [...(state.questionPosts || []), ...action.payload] }; // this assumes you hit each get route (for qposts) only once.
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
