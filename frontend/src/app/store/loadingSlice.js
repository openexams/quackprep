import { createSelector } from '@reduxjs/toolkit';

const LOADING_START = 'app/store/LOADING_START';
const LOADING_STOP = 'app/store/LOADING_STOP';

export function startLoading(componentsName) {
  return {
    type: LOADING_START,
    payload: componentsName,
  };
}

export function stopLoading(componentsName) {
  return {
    type: LOADING_STOP,
    payload: componentsName,
  };
}

const DEFAULT_STATE = {
  loadingComps: {},
};

function loadComps(state, toLoad, bool) {
  let compsCopy = structuredClone(state.loadingComps);
  if (Array.isArray(toLoad)) {
    for (let i = 0; i < toLoad.length; i++) {
      compsCopy = { ...compsCopy, [toLoad[i]]: bool };
    }
  } else {
    compsCopy = { ...compsCopy, [toLoad]: bool };
  }
  return { ...state, loadingComps: compsCopy };
}

export default function loadingReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case LOADING_START: {
      return loadComps(state, action.payload, true);
    }
    case LOADING_STOP: {
      return loadComps(state, action.payload, false);
    }
    default:
      return state;
  }
}

export const selectLoadingState = createSelector(
  (state) => state,
  (state) => ({ loadingComps: state.loading.loadingComps }),
);
