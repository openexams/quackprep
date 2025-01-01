import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { firstLetterUppercase } from '@utils/helperFuncs';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from './app/auth/authSlice';
import { upsertTimeSpent } from '@components/navbar/navbarSlice';

export default function Sentinel() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser).user;
  const userIdRef = useRef(user.id);

  const location = useLocation();

  useEffect(() => {
    const urlArr = location.pathname?.split('/');
    if (urlArr[1]) {
      document.title = firstLetterUppercase(urlArr[1]) + ' - ' + 'Quackprep';
    }
  }, [location]);

  useEffect(() => {
    userIdRef.current = user.id;
  }, [user.id]); // keep userIdRef.current up to date with user.id

  useEffect(() => {
    const interval = setInterval(() => {
      if (userIdRef.current) {
        // cant use user.id here as it takes the user.id value and saves it for every callm, while useRef.current is a pointer to the value ( thats how I like to think ab it )
        dispatch(upsertTimeSpent()); // TODO TEST
      }
    }, 300000); // runs every 5 minute

    return () => clearInterval(interval);
  }, []);

  return null;
}
