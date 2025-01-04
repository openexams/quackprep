import { standardApiCall } from '@utils/api';

export const GEN_AI_QUESTION_RES = 'app/class/question/ai/GEN_AI_QUESTION';
export const GEN_AI_Q_AND_C_RES = 'app/class/question/ai/GEN_AI_Q_AND_C';

export function generateQuestionLike(question_id, question_text) {
  return standardApiCall(
    'post',
    '/api/question/ai/question_like',
    { likeQuestionId: question_id, likeQuestionText: question_text },
    [GEN_AI_QUESTION_RES, GEN_AI_Q_AND_C_RES],
    { loadingComponent: ['QuestionPage, GenerateQuestion'], noticeOfSuccess: 'successfully generated ai question' },
  );
}
