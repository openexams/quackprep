import { Image, Menu } from 'semantic-ui-react';
import './BrandLogo.css';
import { changeNavbarPage } from '@src/app/layout/navbarSlice';
import { useNavigate } from 'react-router-dom';

export default function BrandLogo({}) {
  const navigate = useNavigate();
  return (
    <Menu.Item as={'a'} header onClick={() => changeNavbarPage(navigate, '/')}>
      <Image className='logo' size='mini' src='/img/quackprep_logo.webp' />
      <span className='quackprep' style={{ fontSize: '1.2rem' }}>
        QuackPrep
      </span>
    </Menu.Item>
  );
}
