import { standardApiCall } from '@utils/api';

export function upsertVoteOnQuestion(question_id, vote) {
  return standardApiCall('post', '/api/question/vote/', { question_id, vote }, null, {
    noticeOfSuccess: 'voted on question! thanks for the feedback!!',
  });
}
