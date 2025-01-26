import { Sidebar, Menu, Icon } from 'semantic-ui-react';
import BrandLogo from '@app/layout/brandlogo/BrandLogo';
import ProfileDropdown from '@app/layout/profile/ProfileDropdown';
import ToggleEditComponent from '@components/ToggleEdit';
import { Link } from 'react-router-dom';
import './navbar.css'; // Import the CSS file

// Define a style for all Menu.Items
const menuItemStyle = {
  minHeight: '60px',
  display: 'flex',
  alignItems: 'center', // vertically centers icon + text
  fontSize: '1.2em', // increases text size
};

export default function Navbar({ isMobile, sidebarOpened, handlePageChange, activePage, user, hasStreak }) {
  return (
    <Sidebar
      as={Menu}
      // 1) Use "push" on desktop so content slides over
      //    Use "overlay" on mobile so it appears on top
      animation='overlay'
      // 2) If not mobile, it should always be visible.
      //    If mobile, it depends on sidebarOpened.
      visible={!isMobile || sidebarOpened}
      inverted
      vertical
    >
      {/* Logo (optional for mobile or desktop) */}
      {!isMobile && <BrandLogo handlePageChange={handlePageChange} />}

      <Menu.Item
        style={{ ...menuItemStyle, marginTop: isMobile ? '5rem' : null }} // same as Layout height
        onClick={handlePageChange}
        as={Link}
        to='/class'
        active={activePage === '/class'}
        name='/class'
      >
        <Icon name='book' />
        Classes
      </Menu.Item>

      <Menu.Item
        style={menuItemStyle}
        onClick={handlePageChange}
        as={Link}
        to='/leaderboard'
        active={activePage === '/leaderboard'}
        name='/leaderboard'
      >
        <Icon name='trophy' />
        Leaderboard
      </Menu.Item>

      <Menu.Item
        style={menuItemStyle}
        onClick={handlePageChange}
        as={Link}
        to='/stats'
        active={activePage === '/stats'}
        name='/stats'
      >
        <Icon name='chart bar' />
        Stats
      </Menu.Item>

      <Menu.Item
        style={menuItemStyle}
        onClick={handlePageChange}
        as={Link}
        to='/create'
        active={activePage === '/create'}
        name='/create'
      >
        <Icon name='plus' />
        AI Create
      </Menu.Item>

      {user && user.id ? (
        <Menu.Item style={menuItemStyle}>
          <ProfileDropdown hasStreak={hasStreak} activePage={activePage} handlePageChange={handlePageChange} />
        </Menu.Item>
      ) : (
        <Menu.Item
          style={menuItemStyle}
          onClick={handlePageChange}
          as={Link}
          to='/auth'
          active={activePage === '/auth'}
          name='/auth'
        >
          <Icon name='user' />
          Login / Signup
        </Menu.Item>
      )}

      <ToggleEditComponent />
    </Sidebar>
  );
}
