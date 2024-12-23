import { standardApiCall } from '@utils/api';
import { createSelector } from 'reselect';

const GET_QUESTIONS_ANSWERED_BY_MONTH_AND_YEAR = '/app/stats/GET_QUESTIONS_ANSWERED_BY_MONTH_AND_YEAR';
const GET_MY_STATS = '/app/stats/GET_MY_STATS';

export function getQuestionsAnsweredByMonthAndYear() {
  return standardApiCall('get', '/api/choice/qsansweredbymandy', null, GET_QUESTIONS_ANSWERED_BY_MONTH_AND_YEAR, {
    loadingComponent: 'Stats',
  });
} // maybe make more generic api routes where user can just give a time [0, x] and you give back the data.

export function getMyStats() {
  return standardApiCall('get', '/api/account/stats', null, GET_MY_STATS, { loadingComponent: 'Stats' });
} // maybe make more generic api routes where user can just give a time [0, x] and you give back the data.

const DEFAULT_STATE = {
  myStats: null,
  questionsAnsweredByMonthAndYear: null,
};

export default function statsReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_QUESTIONS_ANSWERED_BY_MONTH_AND_YEAR:
      return { ...state, questionsAnsweredByMonthAndYear: action.payload };
    case GET_MY_STATS:
      return { ...state, myStats: action.payload };
    default:
      return state;
  }
}

export const selectStatsState = createSelector(
  (state) => state,
  function (state) {
    return { stats: state.app.stats };
  },
);

export const selectMYStatsState = (state) => {
  return state.app.stats.myStats;
};
