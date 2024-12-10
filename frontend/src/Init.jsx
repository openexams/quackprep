import { useEffect } from 'react';
import { changeNavbarPage } from '@components/navbar/navbarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from './app/auth/authSlice';
import { getClassCategories } from './app/class/class_categories/classCategorySlice';
import { getFavoriteQuestions, removeStateFavoriteQuestions } from '@src/app/favorite/favoriteSlice';
import { getCurrentChoices, removeStateCurrentChoices } from '@src/app/class/question/choices/choicesSlice';
import { getSchools } from './app/class/school/schoolSlice';
export default function Init() {
  const user = useSelector(selectUser).user;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const curPage = location.pathname + location.search + location.hash;
    dispatch(changeNavbarPage(navigate, curPage));
    dispatch(getClassCategories());
    dispatch(getSchools());
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

  useEffect(() => {
    if (user?.id) {
      dispatch(getFavoriteQuestions());
      dispatch(getCurrentChoices());
    } else {
      dispatch(removeStateCurrentChoices());
      dispatch(removeStateFavoriteQuestions());
    }
  }, [user?.id]);

  return null;
}
