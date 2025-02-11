import { standardApiCall } from '@utils/api';
const UPSERT_VOTE_ON_CLASS = 'app/class/vote/upsertVoteOnClass';

export function upsertVoteOnClass(class_id, vote) {
  return standardApiCall('post', '/api/class/vote/', { class_id, vote }, UPSERT_VOTE_ON_CLASS, { loadingComponent: 'ClassVote' });
}
