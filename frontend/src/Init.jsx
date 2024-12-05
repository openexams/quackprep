import { useEffect } from 'react';
import { changeNavbarPage } from '@components/navbar/navbarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from './app/auth/authSlice';
import { getFavoriteQuestions, removeStateFavoriteQuestions } from '@src/app/favorite/favoriteSlice';
export default function Init() {
  const user = useSelector(selectUser).user;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const curPage = location.pathname + location.search + location.hash;
    dispatch(changeNavbarPage(navigate, curPage));
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
    if (user?.id) dispatch(getFavoriteQuestions());
    else {
      dispatch(removeStateFavoriteQuestions());
    }
  }, [user?.id]);

  return null;
}
