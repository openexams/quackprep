import { standardApiCall } from '@utils/api';

/**
 *
 * @param {*} user_id
 * @param {*} type
 * @param {String} resultAction redux result action constant
 * @returns
 */
export function getGroupsByUserId(type, resultAction) {
  return standardApiCall('get', `/api/group/user/${type}`, null, resultAction, { loadingComponent: 'Create' });
}

export function deleteGroupById(id, resultAction) {
  return standardApiCall('delete', `/api/group/${id}`, null, resultAction, {
    loadingComponent: 'Create',
    noticeOfSuccess: 'successfully deleted group!',
  });
}

export function upsertGroup(id, name, class_id, type, desc, resultAction) {
  return standardApiCall('post', `/api/group/${type}`, { id, name, class_id, desc }, resultAction, {
    loadingComponent: 'Create',
    noticeOfSuccess: 'successfully created group!',
  });
}
