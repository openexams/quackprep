import { combineReducers, configureStore } from '@reduxjs/toolkit';

import loadingReducer from './loadingSlice';

import flashReducer from '@components/flashmessage/flashMessageSlice';
import homeReducer from '../home/homeSlice';
import loginReducer from '../auth/login/loginSlice';
import navbarReducer from '@components/navbar/navbarSlice';
import streakReducer from '../streak/streakSlice';
import classReducer from '@src/app/class/classSlice';
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

const app = combineReducers({
  home: homeReducer,
  navbar: navbarReducer,
  streak: streakReducer,
  class: combineReducers({ classes: classReducer, classCategories: classCategoriesReducer }),
  question: questionsReducer,
  leaderboard: leadboardReducer,
  choices: choicesReducer,
  group: groupReducer,
  stats: statsReducer,
  school: schoolsReducer,
  pdf: pdfsReducer,
  favorites: favoriteReducer,
});
const auth = combineReducers({ user: loginReducer });

export default configureStore({
  reducer: { flashMessage: flashReducer, show401: reducer401, loading: loadingReducer, app, auth },
});
