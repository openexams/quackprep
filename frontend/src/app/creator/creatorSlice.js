import { standardApiCall } from '@utils/api';
import { MAKE_USER_A_CREATOR } from '../auth/login/loginSlice';

export function makeUserACreator() {
  return standardApiCall('post', '/api/creator/become', {}, MAKE_USER_A_CREATOR, {
    loadingComponent: 'CreatorDashboard',
    noticeOfSuccess: 'you are now a creator! Go to the how it works part of creator dashboard to get started!',
  });
}
