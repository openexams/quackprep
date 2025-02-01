import { standardApiCall } from '@utils/api';
import { createSelector } from '@reduxjs/toolkit';

const GET_CLASS_CATEGORIES = 'app/class/class_categories/GET_CLASS_CATEGORIES';

export function getClassCategories() {
  return standardApiCall('get', '/api/class/categories', null, GET_CLASS_CATEGORIES, {
    loadingComponent: ['Create', 'ClassList'],
  });
}

const DEFAULT_STATE = {
  class_categories: null,
};
export default function classCategoriesReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_CLASS_CATEGORIES:
      return { ...state, class_categories: action.payload };
    default:
      return state;
  }
}

export const selectClassCategories = createSelector(
  (state) => state.app.class.classCategories.class_categories,
  (classCategories) => classCategories,
);
