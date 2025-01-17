import { standardApiCall } from '@utils/api';
import { copyArray, updateObjectWithKey, replaceP20WithSpace } from 'maddox-js-funcs';

const CHANGE_NAVBAR_PAGE = 'components/navbar/CHANGE_NAVBAR_PAGE';

const UPDATE_CUR_CLASS = 'components/navbar/UPDATE_CUR_CLASS';
const UPDATE_CUR_GROUP = 'components/navbar/UPDATE_CUR_GROUP';
const UPDATE_CUR_QUESTION = 'components/navbar/UPDATE_CUR_QUESTION';
const GET_CLASS_ID_BY_NAME = 'components/navbar/GET_CLASS_ID_BY_NAME';
const UPDATE_GROUP_ID_NAME = 'components/navbar/UPDATE_GROUP_ID_NAME';

const UPDATE_GROUP_TYPE = 'components/navbar/UPDATE_GROUP_TYPE';

const UPDATE_SCHOOL_ID = 'components/navbar/UPDATE_SCHOOL_ID';
const UPDATE_FETCH_HISTORY = 'components/navbar/UPDATE_FETCH_HISTORY';
const TOGGLE_EDIT = 'components/navbar/TOGGLE_EDIT';

export function upsertTimeSpent() {
  return standardApiCall('post', '/api/account/time_spent', {});
}

/**
 * navigates to given page using rrd navigate() and keeps my navbar state up to date! (middleware)
 * @param {String} name
 * @returns
 */
export function changeNavbarPage(navigate, page) {
  const dupName = page + '';

  navigate(dupName);
  return { type: CHANGE_NAVBAR_PAGE, payload: dupName };
}

/**
 *
 * @param {Number} id
 * @returns
 */
export function updateQuestionId(id) {
  return { type: UPDATE_CUR_QUESTION, payload: id };
}

export function updateCurrentClassData(params) {
  const { id, name } = params;

  return { type: UPDATE_CUR_CLASS, payload: { id, name } };
}

export function updateCurrentGroupData(params) {
  const { id, name } = params;
  return { type: UPDATE_GROUP_ID_NAME, payload: { id, name } };
}

export function updateGroupType(type) {
  return { type: UPDATE_GROUP_TYPE, payload: type };
}

export function updateSchoolId(id) {
  return { type: UPDATE_SCHOOL_ID, payload: id };
}

export function updateFetchHistory(fetechedPage) {
  return { type: UPDATE_FETCH_HISTORY, payload: fetechedPage };
}

export function toggleEdit() {
  return { type: TOGGLE_EDIT };
}

const DEFAULT_STATE = {
  editing: false,
  page: null,
  classId: null,
  className: null,
  schoolId: null,
  schoolName: null,
  groupType: null,
  groupId: null, // this identifies the group, wether that means its a string or a id
  groupName: null,
  questionId: null,
  lastPage: [],
  fetchHistory: {},
};

export default function navbarReducer(state = DEFAULT_STATE, action) {
  if (state.page?.includes('/auth') && (action.type?.includes('UPDATE') || action.type?.includes('GET'))) {
    // BIG ISSUE BUT OK
    return state; // was trying to do stuff with page that had auth?next= in it, since I parse the page using a array split("/") that did not go well
  }
  switch (action.type) {
    case UPDATE_FETCH_HISTORY:
      return { ...state, fetchHistory: updateObjectWithKey(state.fetchHistory, action.payload) };
    case CHANGE_NAVBAR_PAGE: {
      let curUrl = state.page;
      const newLastPage = copyArray(state.lastPage);
      newLastPage.push(state.page);
      if (action.payload?.includes('/auth')) {
        // this in the navbar fucks the ordering of urlArr[], so change noothing
        return {
          ...state,
          page: action.payload,
          schoolName: null,
          groupName: null,
          className: null,
          schoolId: null,
          questionId: null,
          classId: null,
          groupId: null,
          groupType: null,
          lastPage: newLastPage,
          fetchHistory: state.fetchHistory,
        };
      }
      // after base cases
      // same logic that navigate() has
      if (action.payload?.[0] === '/') {
        curUrl = action.payload;
      } else {
        curUrl = state.page + '/' + action.payload;
      }
      if (state.page === curUrl) {
        // if it didnt change dont do anything.
        return state;
      }

      // when I change the navbar set everything back to null so navbar has to dispatch to get id values;
      const urlArr = getFixedUrlArr(curUrl);
      const newSchoolName = urlArr[2] || null;
      const newClassId = urlArr[3] || null;
      const newGroupId = urlArr[5] || null;

      return {
        ...state,
        page: curUrl,
        groupName: null,
        className: null,
        schoolName: newSchoolName,
        schoolId: null,
        questionId: parseInt(urlArr[7]) || null,
        classId: parseInt(newClassId), // these 2 null should be brought in again, only if we changed topic or class, may cause issues when inputting new link directly into window.location TODO TEST
        groupId: parseInt(newGroupId),
        groupType: null,
        lastPage: newLastPage,
        fetchHistory: state.fetchHistory,
      };
    }
    case UPDATE_CUR_CLASS:
      return { ...state, classId: action.payload.id || state.classId, className: action.payload.name || state.className };
    case UPDATE_CUR_GROUP: // TODO FIX
      return { ...state, groupId: action.payload.id || state.groupId, groupName: action.payload.name || state.groupName };
    case UPDATE_CUR_QUESTION: // wrong fix later
      return {
        ...state,
        questionId: parseInt(action.payload),
      };
    case GET_CLASS_ID_BY_NAME:
      if (!action.payload) return state;
      return { ...state, classId: action.payload.id, className: action.payload.name };
    case UPDATE_GROUP_ID_NAME: // TODO FIX
      if (!action.payload) return state;
      return { ...state, groupId: action.payload.id, groupName: replaceP20WithSpace(action.payload.name) };
    case UPDATE_GROUP_TYPE:
      return { ...state, groupType: action.payload };
    case UPDATE_SCHOOL_ID:
      return { ...state, schoolId: action.payload };
    case TOGGLE_EDIT:
      return { ...state, editing: !state.editing };
    default:
      return state;
  }
}

export const selectCurrentPage = function (state) {
  return { page: state.app.navbar.page };
};

export const selectNavbarState = function (state) {
  return { navbar: state.app.navbar };
};

export const selectLastPage = function (state) {
  let lastPage = state.app.navbar.lastPage;
  if (!Array.isArray(lastPage)) {
    return null;
  }
  lastPage = lastPage[lastPage.length - 1];
  return { lastPage: lastPage };
};

/**
 * pass in location.pathname
 * @param {String} curUrl
 */
export function getFixedUrlArr(curUrl) {
  if (!curUrl) {
    return null;
  }
  if (curUrl.includes('?')) {
    curUrl = curUrl.split('?').shift();
  }
  console.log(curUrl);
  return curUrl?.split('/');
}
