import { standardApiCall } from '@utils/api';
import { UPSERT_CRUD_QUESTION } from '../questionSlice';

export function upsertVoteOnQuestion(question_id, vote) {
  return standardApiCall('post', '/api/question/vote/', { question_id, vote }, UPSERT_CRUD_QUESTION, {
    noticeOfSuccess: 'voted on question! thanks for the feedback!!',
  });
}
