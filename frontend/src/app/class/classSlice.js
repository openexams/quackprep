import { standardApiCall } from '@utils/api';
import { createSelector } from 'reselect';
import { filterArr, upsertArray, updateArrWithNewVals } from '@utils/functions';

const GET_CLASSES = 'app/class/GET_CLASSES';
const DELETE_CLASS = 'app/class/DELETE_CLASS';
const UPSERT_CLASSES = 'app/class/UPSERT_CLASSES';

export function getClasses() {
  return standardApiCall('get', '/api/class/', null, GET_CLASSES, 'ClassList');
}

export function getClassesByUserId() {
  return standardApiCall('get', `/api/class/user`, null, GET_CLASSES, ['ClassList', 'Create']);
}

// returns the created class
export function upsertClass(id, school_id, name, description, category) {
  return standardApiCall('post', `/api/class/`, { id, school_id, name, description, category }, UPSERT_CLASSES, ['Create']); // have a action that puts this created class into the classlist
}

export function deleteClassById(id) {
  return standardApiCall('delete', `/api/class/${id}`, null, DELETE_CLASS, ['Create']); // have a action that puts this created class into the classlist
}

const DEFAULT_STATE = {
  classes: null,
};

export default function classReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_CLASSES:
      return { ...state, classes: updateArrWithNewVals(state.classes, action.payload) };
    case UPSERT_CLASSES:
      return { ...state, classes: upsertArray(state.classes, action.payload?.[0]) };

    case DELETE_CLASS:
      return { ...state, classes: filterArr(state.classes, action.payload) };
    default:
      return state;
  }
}

export const selectClassState = createSelector(
  (state) => state,
  function (state) {
    return { classes: state.app.class.classes.classes };
  },
);

export function selectClassStateById(id) {
  return createSelector(
    (state) => state,
    function (state) {
      if (!state.app.class.classes.classes) return [];
      return { classes: state.app.class.classes.classes[id - 1] };
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
      if (!state.app.class.classes.classes) return [];

      return { classes: state.app.class.classes[findClassIndexByName(state.app.class.classes.classes, name)] };
    },
  );
}
