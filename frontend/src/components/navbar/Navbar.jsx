// not using navbar css file
import { Menu, Container, Icon, Sidebar, Button, Transition } from 'semantic-ui-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@src/app/auth/authSlice';
import { changeNavbarPage, getFixedUrlArr, selectCurrentPage, selectNavbarState, updateGroupType } from './navbarSlice';
import ProfileDropdown from './components/Profile/ProfileDropdown';
import { useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from './components/BrandLogo';
import { selectHasStreak } from '@src/app/streak/streakSlice.js';
import { selectClassState } from '@src/app/class/classSlice';
import { selectSchoolState } from '@src/app/class/school/schoolSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import { select401CompState } from '@components/401/401Slice';
import {
  classFetchLogic,
  groupFetchLogic,
  groupUpdateLogic,
  classUpdateLogic,
  schoolUpdateLogic,
  questionFetchLogic,
  questionUpdateLogic,
  choicesFetchLogic,
  pdfsFetchLogic,
} from './navbarFunctions';
import Init from '@src/Init';
import Sentinel from '@src/Sentinel';
import { selectGroupsState } from '@src/app/class/group/groupSlice';
import ToggleEditComponent from './components/ToggleEdit';

export default function Navbar() {
  const groups = useSelector(selectGroupsState);
  const { classes } = useSelector(selectClassState);
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const { hasStreak } = useSelector(selectHasStreak);
  const { page: activePage } = useSelector(selectCurrentPage);
  const navigate = useNavigate();
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const schools = useSelector(selectSchoolState).schools;
  const loading = useSelector(selectLoadingState)?.loadingComps;
  const State401 = useSelector(select401CompState).show;
  const pathArray = getFixedUrlArr(activePage);

  // spaces in stuff is a issue!!
  const { className, classId, groupName, groupId, questionId, schoolName, groupType, schoolId } =
    useSelector(selectNavbarState).navbar;

  function handlePageChange(e, data) {
    e.preventDefault();

    dispatch(changeNavbarPage(navigate, data.name));
    setSidebarOpened(false); // Close sidebar on item click
  }

  ///  USE EFFECTS FOR KEEPING STORE SAME AS URL ///
  useEffect(() => {
    if (pathArray?.[1]?.includes('class') && !activePage?.includes('/auth?next') && !State401) {
      if (pathArray?.[4] && className && classId) {
        dispatch(updateGroupType(pathArray[4]));
      }
      if (!loading?.SchoolsList) {
        schoolUpdateLogic(dispatch, schools, schoolName);
      }
      if (!loading?.ClassList && schoolId && schoolName) {
        classFetchLogic(dispatch, classes, schoolId);
        classUpdateLogic(dispatch, classes, classId, schoolId);
      }
      if (pathArray?.[4] === 'pdfexams' && !loading?.PDFList && classId && schoolId && schoolName && className) {
        pdfsFetchLogic(dispatch, classId);
      }

      if (pathArray?.[4] === 'group' && !loading?.GroupsList && classId && className && schoolId && schoolName) {
        groupUpdateLogic(dispatch, groupId, classId, groups);
        groupFetchLogic(dispatch, classId);
      }
      if (
        pathArray?.[4] === 'group' &&
        pathArray?.[6] === 'question' &&
        !loading?.QuestionPage &&
        classId &&
        groupId &&
        groupName &&
        groupType &&
        schoolId &&
        schoolName
      ) {
        questionUpdateLogic(dispatch, questionId);
        questionFetchLogic(dispatch, groupId);
      }
      if (
        pathArray?.[4] === 'group' &&
        pathArray?.[6] === 'question' &&
        !loading?.ChoiceRouter &&
        className &&
        classId &&
        groupId &&
        groupName &&
        groupType
      ) {
        choicesFetchLogic(dispatch, groupId);
      }
    }
  }, [
    activePage,
    classId,
    className,
    groups,
    groupId,
    groupType,
    groupName,
    classes,
    schoolName,
    schools,
    schoolId,
    questionId,
    loading?.GroupsList,
    loading?.ClassList,
    loading?.QuestionPage,
    loading?.ChoiceRouter,
    loading?.PdfList,
  ]);

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
      <Init />
      <Sentinel />
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
            <ToggleEditComponent />
            {user.id ? (
              <Menu.Menu position='right'>
                <ProfileDropdown hasStreak={hasStreak} activePage={activePage} handlePageChange={handlePageChange} />
              </Menu.Menu>
            ) : (
              <Menu.Item
                onClick={handlePageChange}
                as='a'
                href='/auth'
                active={activePage === '/auth'}
                name='/auth'
                position='right'
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
