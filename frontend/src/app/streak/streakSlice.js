import { standardApiCall } from '@utils/api.js';
import { createSelector } from '@reduxjs/toolkit';

const GET_HAS_STREAK = 'app/streak/GET_HAS_STREAK';
const GET_STREAK = 'app/streak/GET_STREAK';

export function getHasStreak() {
  return standardApiCall('get', '/api/streak/has_streak', null, GET_HAS_STREAK);
}

export function getStreak() {
  return standardApiCall('get', '/api/streak/', null, GET_STREAK, { loadingComponent: 'Streak' });
}

export function claimStreak() {
  return standardApiCall('post', '/api/streak/', {}, GET_STREAK, { loadingComponent: 'Streak' }); // uses same dispatching const ik ik
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
      return { ...state, hasStreak: action.payload };

    case GET_STREAK:
      if (!action.payload?.last_claim) {
        return state;
      }
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
  (state) => state.app.streak.hasStreak,
  (hasStreak) => hasStreak,
);

export const selectStreakData = function (state) {
  return { streak: state.app.streak };
};
