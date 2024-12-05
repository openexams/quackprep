import { useEffect } from 'react';
import { changeNavbarPage } from '@components/navbar/navbarSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
export default function Init() {
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

  return null;
}
