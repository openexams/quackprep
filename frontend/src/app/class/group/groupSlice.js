import { standardApiCall } from '@utils/api';

import { updateArrObjectsWithNewVals, filterArr, upsertArray, countingSort } from 'maddox-js-funcs';

const GET_GROUPS = 'app/class/group/GET_GROUPS';
const DELETE_GROUP = 'app/class/group/DELETE_GROUP';
const UPSERT_GROUP = 'app/class/group/UPSERT_GROUP';

export function getGroupsByClassId(classId) {
  return standardApiCall('get', `/api/group/${classId}/`, null, GET_GROUPS, { loadingComponent: 'GroupsList' });
}

/**
 *
 * @param {*} user_id
 * @param {*} type
 * @returns
 */
export function getGroupsByUserId() {
  return standardApiCall('get', `/api/group/user/`, null, GET_GROUPS, { loadingComponent: 'Create' });
}

export function deleteGroupById(id) {
  return standardApiCall('delete', `/api/group/${id}`, null, DELETE_GROUP, {
    loadingComponent: 'Create',
    noticeOfSuccess: 'successfully deleted group!',
  });
}

export function upsertGroup(id, name, class_id, type, desc) {
  return standardApiCall('post', `/api/group/${type}`, { id, name, class_id, desc }, UPSERT_GROUP, {
    loadingComponent: 'Create',
    noticeOfSuccess: 'successfully created group!',
  });
}

const DEFAULT_STATE = {
  groups: null,
};

export default function groupReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_GROUPS:
      console.log(action.payload);
      return {
        ...state,
        groups: countingSort(updateArrObjectsWithNewVals(state.groups, action.payload), 'class_id'),
      };
    case DELETE_GROUP:
      return { ...state, groups: filterArr(state.groups, action.payload) };
    case UPSERT_GROUP:
      return { ...state, groups: upsertArray(state.groups, action.payload?.[0]) };
    default:
      return state;
  }
}

export const selectGroupsState = (state) => state.app.group.groups;
