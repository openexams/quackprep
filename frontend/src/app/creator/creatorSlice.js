import { standardApiCall } from '@utils/api';

export default function submitCreatorForm(school, the_why) {
  return standardApiCall('post', '/api/creator', { school, the_why }, null, {
    loadingComponent: 'CreatorDashboard',
    noticeOfSuccess: 'successfully submitted creator form!',
  });
}
