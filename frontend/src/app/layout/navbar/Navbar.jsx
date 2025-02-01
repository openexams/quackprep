import { Sidebar, Menu, Icon } from 'semantic-ui-react';
import BrandLogo from '@app/layout/brandlogo/BrandLogo';
import ProfileDropdown from '@app/layout/profile/ProfileDropdown';
import ToggleEditComponent from '@components/ToggleEdit';
import { Link } from 'react-router-dom';

// Define styles
const menuItemStyle = {
  minHeight: '60px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '1.2em',
  position: 'sticky !important',
};

const aiHeaderStyle = {
  //fontSize: '1.3em',
  padding: '1em 1em 0.5em 1em',
  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
  color: '#f3f4f6 !important',
};

const aiSubItemStyle = {
  fontSize: '50em !important', // not working
  position: 'relative',
  marginLeft: '1em',
  borderLeft: '2px solid rgba(255, 255, 255, 0.1)',
};

export default function Navbar({ isMobile, sidebarOpened, handlePageChange, activePage, user, hasStreak }) {
  return (
    <Sidebar as={Menu} animation='overlay' visible={!isMobile || sidebarOpened} inverted vertical>
      {!isMobile && <BrandLogo handlePageChange={handlePageChange} />}

      <Menu.Item
        style={{ ...menuItemStyle, marginTop: isMobile ? '5rem' : null }}
        onClick={handlePageChange}
        as={Link}
        to='/class'
        active={activePage && activePage?.includes('/class')}
        name='/class'
      >
        <Icon name='book' />
        Classes
      </Menu.Item>

      <Menu.Item
        style={{ ...menuItemStyle }}
        onClick={handlePageChange}
        as={Link}
        to='/create'
        active={activePage === '/create'}
        name='/create'
      >
        <Icon name='plus' />
        AI Exam Parser
      </Menu.Item>

      {/* <Menu.Item
        style={{ ...menuItemStyle, ...aiSubItemStyle }}
        onClick={handlePageChange}
        as={Link}
        to='/solve' // You might want to update this route if different from '/create'
        active={activePage === '/solve'}
        name='/solve'
      >
        <Icon name='pencil alternate' />
        Solve
      </Menu.Item> */}

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
