// not using navbar css file
import { Menu, Container, Icon, Sidebar, Transition } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@src/app/auth/authSlice';
import { changeNavbarPage, getFixedUrlArr, selectCurrentPage, selectNavbarState, updateGroupType } from './navbarSlice';
import ProfileDropdown from './components/Profile/ProfileDropdown';
import { useNavigate } from 'react-router-dom';
import BrandLogo from './components/BrandLogo';
import { selectHasStreak } from '@src/app/streak/streakSlice.js';

import ToggleEditComponent from './components/ToggleEdit';
import PlusButton from '@components/PlusButton/PlusButton';

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const { hasStreak } = useSelector(selectHasStreak);
  const { page: activePage } = useSelector(selectCurrentPage);
  const navigate = useNavigate();
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  function handlePageChange(e, data) {
    e.preventDefault();

    dispatch(changeNavbarPage(navigate, data.name));
    setSidebarOpened(false); // Close sidebar on item click
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          <Menu fixed='top' inverted size='large' className='custom-navbar'>
            <Container>
              <Menu.Item onClick={() => setSidebarOpened(!sidebarOpened)} className='sidebar-toggle'>
                <Icon name='sidebar' size='large' />
              </Menu.Item>
              <BrandLogo handlePageChange={handlePageChange} />
            </Container>
          </Menu>

          <Transition visible={sidebarOpened} animation='overlay' duration={300}>
            <Sidebar
              as={Menu}
              animation='overlay'
              inverted
              vertical
              visible={sidebarOpened}
              onHide={() => setSidebarOpened(false)}
              className='custom-sidebar'
            >
              <Menu.Item className='sidebar-brand'>
                <BrandLogo handlePageChange={handlePageChange} />
              </Menu.Item>

              <Menu.Item
                onClick={handlePageChange}
                as='a'
                href='/class'
                active={activePage === '/class'}
                name='/class'
                className='nav-item'
              >
                <Icon name='book' />
                Classes
              </Menu.Item>

              <Menu.Item
                onClick={handlePageChange}
                as='a'
                href='/leaderboard'
                active={activePage === '/leaderboard'}
                name='/leaderboard'
                className='nav-item'
              >
                <Icon name='trophy' />
                Leaderboard
              </Menu.Item>

              <Menu.Item
                onClick={handlePageChange}
                as='a'
                href='/stats'
                active={activePage === '/stats'}
                name='/stats'
                className='nav-item'
              >
                <Icon name='chart bar' />
                Stats
              </Menu.Item>
              <ToggleEditComponent />
              <PlusButton onClick={() => changeNavbarPage(navigate, '/new')} />

              {user.id ? (
                <Menu.Item className='nav-item'>
                  <ProfileDropdown hasStreak={hasStreak} activePage={activePage} handlePageChange={handlePageChange} />
                </Menu.Item>
              ) : (
                <Menu.Item
                  onClick={handlePageChange}
                  as='a'
                  href='/auth'
                  active={activePage === '/auth'}
                  name='/auth'
                  className='nav-item'
                >
                  <Icon name='user' />
                  Login / Signup
                </Menu.Item>
              )}
            </Sidebar>
          </Transition>
        </>
      ) : (
        <Menu fixed='top' inverted size='large' className='custom-navbar'>
          <Container>
            <BrandLogo handlePageChange={handlePageChange} />

            <Menu.Item
              onClick={handlePageChange}
              as='a'
              href='/class'
              active={activePage === '/class'}
              name='/class'
              className='nav-item'
            >
              <Icon name='book' />
              Classes
            </Menu.Item>

            <Menu.Item
              onClick={handlePageChange}
              as='a'
              href='/leaderboard'
              active={activePage === '/leaderboard'}
              name='/leaderboard'
              className='nav-item'
            >
              <Icon name='trophy' />
              Leaderboard
            </Menu.Item>

            <Menu.Item
              onClick={handlePageChange}
              as='a'
              href='/stats'
              active={activePage === '/stats'}
              name='/stats'
              className='nav-item'
            >
              <Icon name='chart bar' />
              Stats
            </Menu.Item>
            <Menu.Menu position='right'>
              <ToggleEditComponent />
            </Menu.Menu>
            <Menu.Menu position='right'>
              <PlusButton
                style={{ marginTop: '.8rem', minWidth: 60, minHeight: 60, maxWidth: 60, maxHeight: 60 }}
                onClick={() => changeNavbarPage(navigate, '/new')}
                popupText={'Generate new Material'}
              />
            </Menu.Menu>

            {user.id ? (
              <ProfileDropdown hasStreak={hasStreak} activePage={activePage} handlePageChange={handlePageChange} />
            ) : (
              <Menu.Item
                onClick={handlePageChange}
                as='a'
                href='/auth'
                active={activePage === '/auth'}
                name='/auth'
                className='nav-item auth-button'
              >
                <Icon name='user' />
                Login / Signup
              </Menu.Item>
            )}
          </Container>
        </Menu>
      )}
    </>
  );
}
