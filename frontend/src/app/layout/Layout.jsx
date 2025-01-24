// Layout.jsx
import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarPushable, SidebarPusher, Menu, Icon, Container, Segment } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { changeNavbarPage, selectCurrentPage } from './navbarSlice';
import { selectUser } from '@src/app/auth/authSlice';
import { selectHasStreak } from '@src/app/streak/streakSlice.js';
import Navbar from './Navbar.jsx';

export default function Layout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux store data
  const { page: activePage } = useSelector(selectCurrentPage);
  const { user } = useSelector(selectUser);
  const { hasStreak } = useSelector(selectHasStreak);

  // Handle window resize for isMobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = (bool) => {
    if (bool !== undefined) {
      setSidebarOpened(bool);
    } else {
      setSidebarOpened(!sidebarOpened);
    }
  };

  function handlePageChange(e, data) {
    e.preventDefault();
    dispatch(changeNavbarPage(navigate, data.name));
    setSidebarOpened(false);
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* MOBILE TOP BAR (Only for small screens) */}
      {isMobile && (
        <Menu inverted attached='top' borderless>
          <Menu.Item onClick={() => handleToggleSidebar()}>
            <Icon name='sidebar' />
          </Menu.Item>
          <Menu.Item header>
            <span style={{ fontSize: '1.2rem' }}>QuackPrep.com</span>
          </Menu.Item>
        </Menu>
      )}

      <Sidebar.Pushable as='div' style={{ minHeight: '100vh' }}>
        <Navbar
          isMobile={isMobile}
          sidebarOpened={sidebarOpened}
          handleToggleSidebar={handleToggleSidebar}
          handlePageChange={handlePageChange}
          activePage={activePage}
          user={user}
          hasStreak={hasStreak}
          navigate={navigate}
          dispatch={dispatch}
          changeNavbarPage={changeNavbarPage}
        />

        {/* 
          If you want a "push" effect on desktop, we add a margin-left of 
          260px (the sidebar width). Keep it 0 on mobile. 
        */}
        <Sidebar.Pusher
          style={{
            minHeight: '100vh',
            marginLeft: !isMobile ? '260px' : 0,
            transition: 'margin-left 0.3s ease',
          }}
          dimmed={isMobile && sidebarOpened}
          onClick={() => {
            // Close sidebar if user taps outside of it on mobile
            if (isMobile && sidebarOpened) setSidebarOpened(false);
          }}
        >
          <Container fluid>
            <Segment basic>{children}</Segment>
          </Container>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
}
