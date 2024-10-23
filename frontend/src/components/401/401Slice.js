import { createSelector } from 'reselect';
const SHOW_401_MSG = '/components/401/SHOW_401_MSG';
const HIDE_401_MSG = '/components/401/HIDE_401_MSG';

export function show401Msg() {
  return { type: SHOW_401_MSG };
}

export function hide401Msg() {
  return { type: HIDE_401_MSG };
}

const DEFAULT_STATE = {
  show: false,
};

export default function reducer401(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case SHOW_401_MSG:
      return { ...state, show: true };
    case HIDE_401_MSG:
      return { ...state, show: false };
    default:
      return state;
  }
}

export const select401CompState = createSelector(
  (state) => state,
  function (state) {
    return {
      show: state.show401.show,
    };
  },
);
