import { selectUser } from '@src/app/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Image, Icon, Modal } from 'semantic-ui-react';
import { signOut } from '@src/app/auth/login/loginSlice';
import { useState } from 'react';
import ConfirmSignoutModal from './ConfirmSignoutModal';
import fireGif from '/img/fire_flame.gif';
import { changeNavbarPage } from '@components/navbar/navbarSlice';

export default function ProfileDropdown({ activePage, handlePageChange, hasStreak }) {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const [confimOpen, setConfirmOpen] = useState(false);
  return (
    <Dropdown
      item
      direction='left'
      trigger={
        <span>
          <Image avatar src={user.icon} /> {user.username} {hasStreak && <Image avatar src={fireGif} />}
        </span>
      }
    >
      <Dropdown.Menu>
        <Dropdown.Item name='/profile' active={activePage === '/profile'} onClick={handlePageChange}>
          Profile
        </Dropdown.Item>
        <Dropdown.Item onClick={handlePageChange} active={activePage === '/streak'} name='/streak'>
          Streak
          <Icon name='fire' color='orange' />
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setConfirmOpen(true)}>Sign Out</Dropdown.Item>
        {confimOpen ? (
          <ConfirmSignoutModal
            open={confimOpen}
            onSubmit={() => {
              dispatch(signOut());
              setConfirmOpen(false);
              dispatch(changeNavbarPage('/home'));
            }}
          />
        ) : null}
      </Dropdown.Menu>
    </Dropdown>
  );
}
