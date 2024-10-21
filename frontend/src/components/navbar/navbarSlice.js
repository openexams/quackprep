import { createSelector } from 'reselect';
import { standardApiCall } from '@utils/api';

const CHANGE_NAVBAR_PAGE = 'components/navbar/CHANGE_NAVBAR_PAGE';
const UPDATE_CUR_CLASS = 'components/navbar/UPDATE_CUR_CLASS';
const UPDATE_CUR_GROUP = 'components/navbar/UPDATE_CUR_GROUP';
const UPDATE_CUR_QUESTION = 'components/navbar/UPDATE_CUR_QUESTION';
const GET_CLASS_ID_BY_NAME = 'components/navbar/GET_CLASS_ID_BY_NAME';
const UPDATE_GROUP_ID_NAME = 'components/navbar/UPDATE_GROUP_ID_NAME';

const UPDATE_GROUP_TYPE = 'components/navbar/UPDATE_GROUP_TYPE';

export function getClassIdByClassName(className) {
  return standardApiCall('get', `/api/class/${className}`, null, GET_CLASS_ID_BY_NAME, 'ClassList');
}

export function getTopicIdbyClassNameAndTopicName(topicName, className) {
  return standardApiCall('get', `/api/group/topic/${topicName}/${className}`, null, UPDATE_GROUP_ID_NAME, 'TopicsShow');
}

/**
 *
 * @param {String} name
 * @returns
 */
export function changeNavbarPage(name) {
  const dupName = name + '';
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

const DEFAULT_STATE = {
  page: null,
  classId: null,
  className: null,
  groupType: null,
  groupId: null, // this identifies the group, wether that means its a string or a id
  groupName: null,
  questionId: null,
};

export default function navbarReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case CHANGE_NAVBAR_PAGE:
      let curUrl = state.page;
      if (action.payload[0] === '/') {
        curUrl = action.payload;
      } else {
        curUrl = state.page + '/' + action.payload;
      }
      if (state.page === curUrl) {
        // if it didnt change dont do anything.
        return state;
      }
      // when I change the navbar set everything back to null so navbar has to dispatch to get id values;
      const urlArr = curUrl.split('/');
      const newClassName = urlArr[2] || null;
      const newGroupName = urlArr[4] || null;

      const newQuestionId = parseInt(urlArr[6]) || null;

      return {
        ...state,
        page: curUrl,
        groupName: newGroupName,
        className: newClassName,
        questionId: parseInt(newQuestionId),
        classId: null, // these 2 null should be brought in again.
        groupId: null,
        groupType: null,
      };
    case UPDATE_CUR_CLASS:
      return { ...state, classId: action.payload.id || state.classId, className: action.payload.name || state.className };
    case UPDATE_CUR_GROUP: // TODO FIX
      return { ...state, groupId: action.payload.id || state.groupId, groupName: action.payload.name || state.groupName };
    case UPDATE_CUR_QUESTION: // wrong fix later
      return {
        ...state,
        questionId: parseInt(action.payload),
        page: `/class/${state.className}/${state.groupType}/${state.groupName}/question/${action.payload}`,
      };
    case GET_CLASS_ID_BY_NAME:
      if (!action.payload) return state;
      return { ...state, classId: action.payload.id, className: action.payload.name };
    case UPDATE_GROUP_ID_NAME: // TODO FIX
      console.log('got');
      if (!action.payload) return state;
      return { ...state, groupId: action.payload.id, groupName: action.payload.name };
    case UPDATE_GROUP_TYPE:
      return { ...state, groupType: action.payload };
    default:
      return state;
  }
}

export const selectCurrentPage = createSelector(
  (state) => state,
  function (state) {
    return { page: state.app.navbar.page };
  },
);

export const selectNavbarState = createSelector(
  (state) => state,
  function (state) {
    return { navbar: state.app.navbar };
  },
);
