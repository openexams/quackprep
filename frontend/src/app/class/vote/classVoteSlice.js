import { standardApiCall } from '@utils/api';
import { UPSERT_CRUD_CLASSES } from '../classSlice';

export function upsertVoteOnClass(class_id, vote) {
  return standardApiCall('post', '/api/class/vote/', { class_id, vote }, UPSERT_CRUD_CLASSES, { loadingComponent: 'ClassVote' });
}
