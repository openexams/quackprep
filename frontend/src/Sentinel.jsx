import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { firstLetterUppercase } from '@utils/helperFuncs';

export default function Sentinel() {
  const location = useLocation();

  useEffect(() => {
    const urlArr = location.pathname?.split('/');
    if (urlArr[1]) {
      document.title = firstLetterUppercase(urlArr[1]) + ' - ' + 'Quackprep';
    }
  }, [location]);

  return null;
}
