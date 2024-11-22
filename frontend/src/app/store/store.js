import { combineReducers, configureStore } from '@reduxjs/toolkit';

import loadingReducer from './loadingSlice.js';

import flashReducer from '@components/flashmessage/flashMessageSlice.js';
import homeReducer from '../home/homeSlice.js';
import loginReducer from '../auth/login/loginSlice.js';
import navbarReducer from '@components/navbar/navbarSlice.js';
import streakReducer from '../streak/streakSlice.js';
import classReducer from '../class/classSlice.js';
import topicReducer from '../class/group/topic/topicSlice.js';
import questionsReducer from '../class/question/questionSlice.js';
import leadboardReducer from '../leaderboard/leaderboardSlice.js';
import choicesReducer from '../class/question/choices/choicesSlice.js';
import statsReducer from '../stats/statsSlice.js';
import examSliceReducer from '../class/group/exam/examSlice.js';
import reducer401 from '@components/401/401Slice.js';
import schoolsReducer from '../class/school/schoolSlice.js';
import classCategoriesReducer from '../class/class_categories/classCategorySlice.js';
import pdfsReducer from '../class/group/pdf/pdfSlice.js';

const app = combineReducers({
  home: homeReducer,
  navbar: navbarReducer,
  streak: streakReducer,
  class: combineReducers({ classes: classReducer, classCategories: classCategoriesReducer }),
  topic: topicReducer,
  question: questionsReducer,
  leaderboard: leadboardReducer,
  choices: choicesReducer,
  stats: statsReducer,
  exam: examSliceReducer,
  school: schoolsReducer,
  pdf: pdfsReducer,
});
const auth = combineReducers({ user: loginReducer });

export default configureStore({
  reducer: { flashMessage: flashReducer, show401: reducer401, loading: loadingReducer, app, auth },
});
