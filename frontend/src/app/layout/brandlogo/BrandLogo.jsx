import { Image, Menu } from 'semantic-ui-react';
import './BrandLogo.css';
import { changeNavbarPage } from '@app/layout/navbar/navbarSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export default function BrandLogo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <Menu.Item as={'a'} header onClick={() => dispatch(changeNavbarPage(navigate, '/'))}>
      <Image alt='quackprep duck' className='logo' size='mini' src='/img/quackprep_logo.webp' />
      <span className='quackprep' style={{ fontSize: '1.2rem' }}>
        QuackPrep
      </span>
    </Menu.Item>
  );
}
