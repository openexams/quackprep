import { selectUser } from '@app/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Image, Icon } from 'semantic-ui-react';
import { signOut } from '@app/auth/login/loginSlice';
import { useState } from 'react';
import ConfirmSignoutModal from './ConfirmSignoutModal';
import fireGif from '/img/fire_flame.gif';

import { useNavigate } from 'react-router-dom';
import { getDefaultIconUrl } from '../../../../../globalFuncs.js';

export default function ProfileDropdown({ activePage, handlePageChange, hasStreak }) {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const [confimOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <Dropdown
      item
      direction='left'
      trigger={
        <span>
          <Image as={'img'} avatar src={user.icon || getDefaultIconUrl(user.username)} /> {user.username}
          {hasStreak && <Image avatar src={fireGif} />}
        </span>
      }
    >
      <Dropdown.Menu>
        <Dropdown.Item onClick={handlePageChange} active={activePage === '/streak'} name='/streak'>
          Streak
          <Icon name='fire' color='orange' />
        </Dropdown.Item>
        <Dropdown.Item name='/account' active={activePage === '/account'} onClick={handlePageChange}>
          Account
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setConfirmOpen(true)}>Sign Out</Dropdown.Item>
        {confimOpen ? (
          <ConfirmSignoutModal
            onClose={setConfirmOpen}
            open={confimOpen}
            onSubmit={() => {
              // timeout is because if no timeout dispatch(signOut()); would not get ran
              dispatch(signOut()); // make sure this goes through
              setTimeout(() => {
                window.location.href = '/'; // refresh all state. unoptimal but easy
              }, 500);
            }}
          />
        ) : null}
      </Dropdown.Menu>
    </Dropdown>
  );
}
