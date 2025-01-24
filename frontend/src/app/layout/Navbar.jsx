import { Sidebar, Menu, Icon } from 'semantic-ui-react';
import BrandLogo from '@components/navbar/components/BrandLogo';
import ProfileDropdown from '@components/navbar/components/Profile/ProfileDropdown';
import ToggleEditComponent from '@components/ToggleEdit';
import PlusButton from '@components/PlusButton/PlusButton';

export default function Navbar({
  isMobile,
  sidebarOpened,
  handleToggleSidebar,
  handlePageChange,
  activePage,
  user,
  hasStreak,
  navigate,
  dispatch,
  changeNavbarPage,
}) {
  return (
    <Sidebar
      as={Menu}
      // 1) Use "push" on desktop so content slides over
      //    Use "overlay" on mobile so it appears on top
      animation={isMobile ? 'overlay' : 'overlay '} // im killing myself
      // 2) If not mobile, it should always be visible.
      //    If mobile, it depends on sidebarOpened.
      visible={!isMobile || sidebarOpened}
      inverted
      vertical
      // "thin" is a narrower sidebar. Change to "wide" or remove if you want a different width
    >
      {/* Logo (optional for mobile or desktop) */}
      {!isMobile && (
        <Menu.Item style={{ cursor: 'pointer' }}>
          <BrandLogo handlePageChange={handlePageChange} />
        </Menu.Item>
      )}

      <Menu.Item onClick={handlePageChange} as='a' href='/class' active={activePage === '/class'} name='/class'>
        <Icon name='book' />
        Classes
      </Menu.Item>

      <Menu.Item onClick={handlePageChange} as='a' href='/leaderboard' active={activePage === '/leaderboard'} name='/leaderboard'>
        <Icon name='trophy' />
        Leaderboard
      </Menu.Item>

      <Menu.Item onClick={handlePageChange} as='a' href='/stats' active={activePage === '/stats'} name='/stats'>
        <Icon name='chart bar' />
        Stats
      </Menu.Item>

      <Menu.Item>
        <ToggleEditComponent />
      </Menu.Item>

      <Menu.Item>
        <PlusButton onClick={() => dispatch(changeNavbarPage(navigate, '/new'))} />
      </Menu.Item>

      {user && user.id ? (
        <Menu.Item>
          <ProfileDropdown hasStreak={hasStreak} activePage={activePage} handlePageChange={handlePageChange} />
        </Menu.Item>
      ) : (
        <Menu.Item onClick={handlePageChange} as='a' href='/auth' active={activePage === '/auth'} name='/auth'>
          <Icon name='user' />
          Login / Signup
        </Menu.Item>
      )}
    </Sidebar>
  );
}
