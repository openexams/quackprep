import { Menu, Image } from 'semantic-ui-react';
import logo from '/img/quackprep_logo.webp';
import './BrandLogo.css';
import { Link } from 'react-router-dom';

export default function BrandLogo({ handlePageChange }) {
  return (
    <Menu.Item
      as={Link}
      to='/'
      header
      onClick={(e, data) => {
        e.preventDefault();
        const fixedData = {
          name: '/',
        };
        handlePageChange(e, fixedData);
      }}
    >
      <Image src={logo} alt='Logo' className='logo' style={{ width: '45px', marginRight: '.7em' }} />
      <span className='quackprep'>QuackPrep</span>
    </Menu.Item>
  );
}
