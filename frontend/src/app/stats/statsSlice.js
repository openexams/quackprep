import { createSelector } from '@reduxjs/toolkit';
import { standardApiCall } from '@utils/api';

const GET_MY_STATS = '/app/stats/GET_MY_STATS';
const GET_ALL_BASE_STATS = '/app/stats/GET_ALL_BASE_STATS';

export function getMyStats() {
  return standardApiCall('get', '/api/account/stats', null, GET_MY_STATS, { loadingComponent: 'MyStats' });
}

export function getAllBaseStats() {
  return standardApiCall('get', '/api/stats/', null, GET_ALL_BASE_STATS, { loadingComponent: 'Stats' });
}

const DEFAULT_STATE = {
  myStats: null,
  questionsAnsweredByMonthAndYear: null,
  tts: null,
  total_ai_questions: null,
  total_classes_created: null,
};

export default function statsReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_ALL_BASE_STATS:
      return { ...state, ...action.payload };
    case GET_MY_STATS:
      return { ...state, myStats: action.payload };
    default:
      return state;
  }
}

export const selectStatsState = createSelector(
  (state) => state,
  (state) => state.app.stats,
);

export const selectMYStatsState = createSelector(
  (state) => state,
  (state) => state.app.stats.myStats,
);
