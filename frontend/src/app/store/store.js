import { combineReducers, configureStore } from '@reduxjs/toolkit';

import loadingReducer from './loadingSlice.js';

import flashReducer from '@components/flashmessage/flashMessageSlice.js';
import homeReducer from '../home/homeSlice.js';
import loginReducer from '../auth/login/loginSlice.js';
import navbarReducer from '@components/navbar/navbarSlice.js';
import streakReducer from '../streak/streakSlice.js';
import classReducer from '../class/classSlice.js';
import topicReducer from '../class/topic/topicSlice.js';
import questionsReducer from '../class/topic/question/questionSlice.js';
import leadboardReducer from '../leaderboard/leaderboardSlice.js';
import choicesReducer from '../class/topic/question/choices/choicesSlice.js';
import statsReducer from '../stats/statsSlice.js';

const app = combineReducers({
  home: homeReducer,
  navbar: navbarReducer,
  streak: streakReducer,
  class: classReducer,
  topic: topicReducer,
  question: questionsReducer,
  leaderboard: leadboardReducer,
  choices: choicesReducer,
  stats: statsReducer,
});
const auth = combineReducers({ user: loginReducer });

export default configureStore({
  reducer: { flashMessage: flashReducer, loading: loadingReducer, app, auth },
});
