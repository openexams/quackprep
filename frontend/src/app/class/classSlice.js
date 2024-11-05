import { standardApiCall } from '@utils/api';
import { createSelector } from 'reselect';

const GET_CLASSES = 'app/class/GET_CLASSES';

export function getClasses() {
  return standardApiCall('get', '/api/class/', null, GET_CLASSES, 'ClassList');
}

export function getClassesByUserId() {
  // TODO maybe make it so stdapicall can take a arrsay of loading comps
  return standardApiCall('get', `/api/class/user/`, null, GET_CLASSES, ['ClassList', 'Create']);
}

const DEFAULT_STATE = {
  classes: null,
};

export default function classReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_CLASSES:
      return { ...state, classes: action.payload };
    default:
      return state;
  }
}

export const selectClassState = createSelector(
  (state) => state,
  function (state) {
    return { classes: state.app.class.classes };
  },
);

export function selectClassStateById(id) {
  return createSelector(
    (state) => state,
    function (state) {
      if (!state.app.class.classes) return [];
      return { classes: state.app.class.classes[id - 1] };
    },
  );
}

function findClassIndexByName(classes, name) {
  for (let i = 0; i < classes.length; i++) {
    if (classes[i].name === name) {
      return i;
    }
  }
  console.error('could not find class');
  return -1;
}

export function selectClassStateByName(name) {
  return createSelector(
    (state) => state,
    function (state) {
      if (!state.app.class.classes) return [];

      return { classes: state.app.class.classes[findClassIndexByName(state.app.class.classes, name)] };
    },
  );
}
