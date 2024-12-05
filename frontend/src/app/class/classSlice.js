import { standardApiCall } from '@utils/api';
import { createSelector } from 'reselect';
import { updateArrObjectsWithNewVals, filterArr, upsertArray } from 'maddox-js-funcs';
import { countingSort } from 'maddox-js-funcs';

const GET_CRUD_CLASSES = 'app/class/GET_CRUD_CLASSES';
const DELETE_CRUD_CLASS = 'app/class/DELETE_CRUD_CLASS';
const UPSERT_CRUD_CLASSES = 'app/class/UPSERT_CRUD_CLASSES';

export function getClassesBySchoolId(school_id) {
  return standardApiCall('get', `/api/class/${school_id}`, null, GET_CRUD_CLASSES, 'ClassList');
}

export function getClassesByUserId() {
  return standardApiCall('get', `/api/class/user`, null, GET_CRUD_CLASSES, ['ClassList', 'Create'], null, null, null);
}

// returns the created class
export function upsertClass(id, school_id, name, description, category) {
  return standardApiCall(
    'post',
    `/api/class/`,
    { id, school_id, name, description, category },
    UPSERT_CRUD_CLASSES,
    ['Create'],
    null,
    null,
    'successfully upserted class!',
  ); // have a action that puts this created class into the classlist
}

export function deleteClassById(id) {
  return standardApiCall(
    'delete',
    `/api/class/${id}`,
    null,
    DELETE_CRUD_CLASS,
    ['Create'],
    null,
    null,
    'successfully deleted class!',
  ); // have a action that puts this created class into the classlist
}

const DEFAULT_STATE = {
  classes: null,
};

export default function classReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_CRUD_CLASSES:
      return {
        ...state,
        classes: countingSort(updateArrObjectsWithNewVals(state.classes, action.payload), 'school_id'),
      };
    case DELETE_CRUD_CLASS:
      return { ...state, classes: filterArr(state.classes, action.payload) };
    case UPSERT_CRUD_CLASSES:
      return { ...state, classes: upsertArray(state.classes, action.payload?.[0]) };
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
