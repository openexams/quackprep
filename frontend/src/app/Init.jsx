import { useEffect } from 'react';
import { changeNavbarPage } from '@app/layout/navbar/navbarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, getCurUser } from '@app/auth/authSlice';
import { getClassCategories } from '@app/class/class_categories/classCategorySlice';
import { getFavoriteQuestions, removeStateFavoriteQuestions } from '@app/class/question/favorite/favoriteSlice';
import { getCurrentChoices, removeStateCurrentChoices } from '@app/class/question/choices/choicesSlice';
import { getSchools } from '@app/class/school/schoolSlice';
import { getHasStreak } from '@app/streak/streakSlice';
import { getAnnouncement } from './layout/navbar/navbarSlice';
export default function Init() {
  const user = useSelector(selectUser).user;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const curPage = location.pathname + location.search + location.hash;
    dispatch(changeNavbarPage(navigate, curPage));
    dispatch(getClassCategories());
    dispatch(getSchools());
    dispatch(getAnnouncement());
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      const pathAfterDomain = window.location.pathname + window.location.search + window.location.hash;
      dispatch(changeNavbarPage(() => {}, pathAfterDomain));
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // on login init
  useEffect(() => {
    if (user?.id) {
      dispatch(getHasStreak());
      dispatch(getFavoriteQuestions());
      dispatch(getCurrentChoices());
    } else {
      dispatch(getCurUser());
      dispatch(removeStateCurrentChoices());
      dispatch(removeStateFavoriteQuestions());
    }
  }, [user?.id]);

  return null;
}
