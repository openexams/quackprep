import { standardApiCall } from '@utils/api';
import { createSelector } from 'reselect';

const GET_TOP_STREAKS = 'app/leaderboard/GET_TOP_STREAKS';
const GET_TOP_QS_ANSWERED = 'app/leaderboard/GET_TOP_QS_ANSWERED';

export function getTopStreaks(x) {
  return standardApiCall('get', `/api/streak/top/${x}`, null, GET_TOP_STREAKS, 'Leaderboard');
}

export function getWhichUsersAnsweredMostQuestions() {
  return standardApiCall('get', `/api/answer/top`, null, GET_TOP_QS_ANSWERED, 'Leaderboard');
}

const DEFAULT_STATE = {
  streaks: null,
  questionsAnswered: null,
};
export default function leadboardReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_TOP_STREAKS:
      return { ...state, streaks: action.payload };
    case GET_TOP_QS_ANSWERED:
      return { ...state, questionsAnswered: action.payload };
    default:
      return state;
  }
}

export const selectLeaderboardState = createSelector(
  (state) => state,
  function (state) {
    return { leaderboard: state.app.leaderboard };
  },
);
