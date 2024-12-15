import { Menu, Image } from 'semantic-ui-react';
import logo from '/img/quackprep_logo.webp';
import './BrandLogo.css';
import { Link } from 'react-router-dom';

export default function BrandLogo({ handlePageChange }) {
  return (
    <Menu.Item
      header
      onClick={(e, data) => {
        const fixedData = {
          name: '/home',
        };
        handlePageChange(e, fixedData);
      }}
    >
      <Image
        as={Link}
        to='/home'
        onClick={(e, d) => e.preventDefault()}
        src={logo}
        alt='Logo'
        className='logo'
        style={{ width: '56px', marginRight: '.7em' }}
      />
      <span className='quackprep'>QuackPrep</span>
    </Menu.Item>
  );
}
