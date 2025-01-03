import { standardApiCall } from '@utils/api';

export function generateQuestionLike(question_id, question_text) {
  return standardApiCall(
    'post',
    '/api/question/ai/question_like',
    { likeQuestionId: question_id, likeQuestionText: question_text },
    null,
    { loadingComponent: ['QuestionPage, GenerateQuestion'], noticeOfSuccess: 'successfully generated ai question' },
  );
}
