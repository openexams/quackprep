import { standardApiCall } from '@utils/api';

import { updateArrObjectsWithNewVals, filterArr, upsertArray, countingSort } from 'maddox-js-funcs';
import { getSchoolByClassId } from '../school/schoolSlice';

export const GROUP_TYPES = ['exam', 'topic']; // will need to switch on backend, i think the table group_types

const GET_GROUPS = 'app/class/group/GET_GROUPS';
const DELETE_GROUP = 'app/class/group/DELETE_GROUP';
const UPSERT_GROUP = 'app/class/group/UPSERT_GROUP';

export function getGroupsByClassId(classId) {
  return standardApiCall('get', `/api/group/${classId}/`, null, GET_GROUPS, {
    loadingComponent: 'GroupsList',
  });
}

/**
 * AI SHIT
 * @param {FormData} Formdata - contains the files to upload
 * @param {number} class_id - The ID of the class
 * @param {string} prompt - The AI prompt to send
 * @returns
 */
export function createGroupGivenPDF(formData, class_id, prompt) {
  formData.append('prompt', prompt); // Add the prompt
  formData.append('class_id', class_id); // Add the class_id
  return async function (dispatch) {
    standardApiCall('post', `/api/ai/group/`, formData, null, {
      // this will not update state to much work just have user refresh or smth
      loadingComponent: ['CreateGroupByPDF'],
      noticeOfSuccess: 'successfully generate group by AI!',
      errorMsg:
        'failed to generate group, make sure to send readable images!\nif you think this is a mistake please contact support',
      axiosConfig: { headers: { 'Content-Type': 'multipart/form-data' } },
      relocateOnCompletion: `/class/${dispatch(getSchoolByClassId(class_id))?.school_name}/${class_id}/group`,
    })(dispatch);
  };
}

// /**
//  *
//  * @param {*} user_id
//  * @param {*} type
//  * @returns
//  */
// export function getGroupsByUserId() {
//   return standardApiCall('get', `/api/group/user/`, null, GET_GROUPS, { loadingComponent: 'GroupsList' });
// }

export function deleteGroupById(id) {
  return standardApiCall('delete', `/api/group/${id}`, null, DELETE_GROUP, {
    loadingComponent: 'GroupsList',
    noticeOfSuccess: 'successfully deleted group!',
  });
}

export function upsertGroup(id, name, class_id, type, desc) {
  return standardApiCall('post', `/api/group/${type}`, { id, name, class_id, desc }, UPSERT_GROUP, {
    loadingComponent: 'GroupsList',
    noticeOfSuccess: 'successfully created group!',
  });
}

const DEFAULT_STATE = {
  groups: null,
};

export default function groupReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_GROUPS:
      return {
        ...state,
        groups: countingSort(updateArrObjectsWithNewVals(state.groups, action.payload), 'class_id'),
      };
    case DELETE_GROUP:
      return { ...state, groups: filterArr(state.groups, action.payload) };
    case UPSERT_GROUP:
      return { ...state, groups: upsertArray(state.groups, action.payload) };
    default:
      return state;
  }
}

export const selectGroupsState = (state) => state.app.group.groups;
