import { standardApiCall } from '@utils/api';

const GET_QUESTIONS_ANSWERED_BY_MONTH_AND_YEAR = '/app/stats/GET_QUESTIONS_ANSWERED_BY_MONTH_AND_YEAR';
const GET_MY_STATS = '/app/stats/GET_MY_STATS';
const GET_TTS = '/app/stats/GET_TTS';
const GET_TOTAL_SUBMISSIONS = '/app/stats/GET_TOTAL_SUBMISSIONS';
const GET_TOTAL_AI_QUESTIONS = '/app/stats/GET_TOTAL_AI_QUESTIONS';

export function getQuestionsAnsweredByMonthAndYear() {
  return standardApiCall('get', '/api/stats/qsansweredbymandy', null, GET_QUESTIONS_ANSWERED_BY_MONTH_AND_YEAR, {
    loadingComponent: 'Stats',
  });
}

export function getMyStats() {
  return standardApiCall('get', '/api/account/stats', null, GET_MY_STATS, { loadingComponent: 'MyStats' });
}

export function getTotalTimeSpent() {
  return standardApiCall('get', '/api/account/time_spent/total', null, GET_TTS, { loadingComponent: 'Stats' });
}

export function getTotalSubmissons() {
  return standardApiCall('get', '/api/stats/answer/total', null, GET_TOTAL_SUBMISSIONS, { loadingComponent: 'Stats' });
}

export function getTotalAiQuestions() {
  return standardApiCall('get', '/api/stats/ai/total', null, GET_TOTAL_AI_QUESTIONS, { loadingComponent: 'Stats' });
}

const DEFAULT_STATE = {
  myStats: null,
  questionsAnsweredByMonthAndYear: null,
  tts: null,
  total_subs: null,
  total_ai_questions: null,
};

export default function statsReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_QUESTIONS_ANSWERED_BY_MONTH_AND_YEAR:
      return { ...state, questionsAnsweredByMonthAndYear: action.payload };
    case GET_MY_STATS:
      return { ...state, myStats: action.payload };
    case GET_TTS:
      return { ...state, tts: action.payload };

    case GET_TOTAL_SUBMISSIONS:
      return { ...state, total_subs: action.payload };
    case GET_TOTAL_AI_QUESTIONS:
      return { ...state, total_ai_questions: action.payload };
    default:
      return state;
  }
}

export const selectStatsState = function (state) {
  return { stats: state.app.stats };
};

export const selectMYStatsState = (state) => {
  return state.app.stats.myStats;
};
