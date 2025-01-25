// Layout.jsx
import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarPushable, SidebarPusher, Menu, Icon, Container, Segment, Image } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { changeNavbarPage, selectCurrentPage } from './navbar/navbarSlice';
import { selectUser } from '@app/auth/authSlice';
import { selectHasStreak } from '@app/streak/streakSlice.js';
import Navbar from './navbar/Navbar.jsx';
import BrandLogo from '@app/layout/brandlogo/BrandLogo';
import useIsMobile from '@utils/hooks/useIsMobile';

export default function Layout({ children }) {
  const isMobile = useIsMobile();
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux store data
  const { page: activePage } = useSelector(selectCurrentPage);
  const { user } = useSelector(selectUser);
  const { hasStreak } = useSelector(selectHasStreak);

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
    if (isMobile) {
      setSidebarOpened(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* MOBILE TOP BAR (Only for small screens) */}
      {isMobile && (
        <Menu inverted attached='top' borderless>
          <Menu.Item onClick={() => handleToggleSidebar()}>
            <Icon name='sidebar' />
          </Menu.Item>
          <BrandLogo />
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
          <Container fluid>{children}</Container>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
}
