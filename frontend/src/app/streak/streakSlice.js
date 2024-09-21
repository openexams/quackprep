import { standardApiCall } from '@utils/api.js';
import { createSelector } from 'reselect';

const GET_HAS_STREAK = 'app/streak/GET_HAS_STREAK';
const GET_STREAK = 'app/streak/GET_STREAK';

export function getHasStreak() {
  return standardApiCall('get', '/api/streak/has_streak', null, GET_HAS_STREAK);
}

export function getStreak() {
  return standardApiCall('get', '/api/streak/', null, GET_STREAK);
}

const DEFAULT_STATE = {
  currentStreak: null,
  longestStreak: null,
  lastClaim: null,
  hasStreak: null,
};

export default function streakReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_HAS_STREAK:
      return { ...state, hasStreak: action.payload.has_streak };

    case GET_STREAK:
      return {
        ...state,
        hasStreak: action.payload.has_streak,
        currentStreak: action.payload.current_streak,
        longestStreak: action.payload.longest_streak,
        lastClaim: action.payload.last_claim,
      };
    default:
      return state;
  }
}

export const selectHasStreak = createSelector(
  (state) => state,
  function (state) {
    return { hasStreak: state.app.streak.hasStreak };
  },
);

export const selectStreakData = createSelector(
  (state) => state,
  function (state) {
    return { streak: state.app.streak };
  },
);
