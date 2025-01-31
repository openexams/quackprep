import { standardApiCall } from '@utils/api';
import { updateArrObjectsWithNewVals, filterArr, upsertArray } from 'maddox-js-funcs';
import { countingSort } from 'maddox-js-funcs';
import { GENERAL_SCHOOL_ID, OTHER_CLASS_CATEGORY_ID } from '../../../../constants';
import { selectUser } from '@app/auth/authSlice';

const GET_CRUD_CLASSES = 'app/class/GET_CRUD_CLASSES';
const DELETE_CRUD_CLASS = 'app/class/DELETE_CRUD_CLASS';
const UPSERT_CRUD_CLASSES = 'app/class/UPSERT_CRUD_CLASSES';

export function createDefaultUserClass() {
  return async function (dispatch, getState) {
    const { username } = selectUser(getState()).user;
    await standardApiCall(
      'post',
      `/api/class/`,
      {
        school_id: GENERAL_SCHOOL_ID,
        name: `${username}'s Study Content`,
        description: `A temporary class to hold ${username}'s Study Content`,
        category: OTHER_CLASS_CATEGORY_ID,
      },
      UPSERT_CRUD_CLASSES,
      {
        loadingComponent: ['ClassList', 'CreateGroupByPDF', 'CreatePage'],
        noticeOfSuccess: 'successfully created default class',
      },
    )(dispatch, getState); // have a action that puts this created class into the classlist
  };
}

export function getClassesBySchoolId(school_id) {
  return standardApiCall('get', `/api/class/${school_id}`, null, GET_CRUD_CLASSES, { loadingComponent: ['ClassList'] });
}

export function getClassesByUserId() {
  return standardApiCall('get', `/api/class/user`, null, GET_CRUD_CLASSES, { loadingComponent: ['ClassList', 'Create'] });
}

// returns the created class
export function upsertClass(id, school_id, name, description, category) {
  if (school_id === '') {
    school_id = null;
  }
  return standardApiCall('post', `/api/class/`, { id, school_id, name, description, category }, UPSERT_CRUD_CLASSES, {
    loadingComponent: ['ClassList'],
    noticeOfSuccess: 'successfully upserted class!',
  }); // have a action that puts this created class into the classlist
}

export function deleteClassById(id) {
  return standardApiCall('delete', `/api/class/${id}`, null, DELETE_CRUD_CLASS, {
    loadingComponent: ['ClassList'],
    noticeOfSuccess: 'successfully deleted class!',
  }); // have a action that puts this created class into the classlist
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
      return { ...state, classes: countingSort(upsertArray(state.classes, action.payload), 'school_id') };
    default:
      return state;
  }
}

export const selectClassState = function (state) {
  return { classes: state.app.class.classes.classes };
};

export function selectClassStateById(id) {
  return function (state) {
    if (!state.app.class.classes.classes) return [];
    return { classes: state.app.class.classes.classes[id - 1] };
  };
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
  return function (state) {
    if (!state.app.class.classes.classes) return [];

    return { classes: state.app.class.classes[findClassIndexByName(state.app.class.classes.classes, name)] };
  };
}
