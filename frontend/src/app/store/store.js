import { combineReducers, configureStore } from '@reduxjs/toolkit';

import loadingReducer from './loadingSlice';
import chatbotReducer from '@app/chatbot/chatbotSlice';

import homeReducer from '../home/homeSlice';
import loginReducer from '../auth/login/loginSlice';
import navbarReducer from '@app/layout/navbar/navbarSlice';
import streakReducer from '../streak/streakSlice';
import classReducer from '@app/class/classSlice';
import questionsReducer from '../class/question/questionSlice';
import leadboardReducer from '../leaderboard/leaderboardSlice';
import choicesReducer from '../class/question/choices/choicesSlice';
import statsReducer from '../stats/statsSlice';
import reducer401 from '@components/401/401Slice';
import schoolsReducer from '../class/school/schoolSlice';
import classCategoriesReducer from '../class/class_categories/classCategorySlice';
import pdfsReducer from '../class/group/pdf/pdfSlice';
import favoriteReducer from '../class/question/favorite/favoriteSlice';
import groupReducer from '../class/group/groupSlice';
import questionPostReducer from '@app/class/question/post/questionPostSlice';

const app = combineReducers({
  chatbot: chatbotReducer,
  home: homeReducer,
  navbar: navbarReducer,
  streak: streakReducer,
  class: combineReducers({ classes: classReducer, classCategories: classCategoriesReducer }),
  question: combineReducers({ questions: questionsReducer, questionPosts: questionPostReducer }),
  leaderboard: leadboardReducer,
  choices: choicesReducer,
  group: groupReducer,
  stats: statsReducer,
  school: schoolsReducer,
  pdf: pdfsReducer,
  favorites: favoriteReducer,
});
const auth = combineReducers({ user: loginReducer });
const store = configureStore({
  reducer: { show401: reducer401, loading: loadingReducer, app, auth },
  devTools: import.meta.env.MODE === 'development' ? true : false, // Disable in production
});

if (import.meta.env.MODE === 'development') {
  window.__REDUX_STATE__ = store.getState;
}
export default store;
