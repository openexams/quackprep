import { standardApiCall } from '@utils/api';

/**
 *
 * @param {*} user_id
 * @param {*} type
 * @param {String} resultAction redux result action constant
 * @returns
 */
export default function getGroupsByUserId(type, resultAction) {
  return standardApiCall('get', `/api/group/user/${type}`, null, resultAction, 'Create');
}
