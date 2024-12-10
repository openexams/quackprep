import { standardApiCall } from '@utils/api';

export default function submitCreatorForm(school, the_why) {
  return standardApiCall(
    'post',
    '/api/creator',
    { school, the_why },
    null,
    ['CreatorDashboard'],
    null,
    null,
    'creator form submission successful',
  );
}
