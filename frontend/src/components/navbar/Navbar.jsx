// not using navbar css file
import { Menu, Container, Icon, Sidebar, Button, Transition } from 'semantic-ui-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@src/app/auth/authSlice';
import { changeNavbarPage, selectCurrentPage, selectNavbarState, updateGroupType, upsertTimeSpent } from './navbarSlice';
import { getCurUser } from '@src/app/auth/authSlice';
import ProfileDropdown from './components/Profile/ProfileDropdown';
import { useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from './components/BrandLogo';
import { getHasStreak, selectHasStreak } from '@src/app/streak/streakSlice.js';
import { selectClassState } from '@src/app/class/classSlice';
import { selectTopicState } from '@src/app/class/group/topic/topicSlice';
import { selectQuestionState } from '@src/app/class/question/questionSlice';
import { selectExamsState } from '@src/app/class/group/exam/examSlice.js';
import { selectSchoolState } from '@src/app/class/school/schoolSlice';
import { selectChoicesState } from '@src/app/class/question/choices/choicesSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import { select401CompState } from '@components/401/401Slice';
import {
  classFetchLogic,
  examFetchLogic,
  topicFetchLogic,
  topicUpdateLogic,
  examUpdateLogic,
  classUpdateLogic,
  schoolFetchLogic,
  schoolUpdateLogic,
  questionFetchLogic,
  questionUpdateLogic,
  choicesFetchLogic,
  pdfsFetchLogic,
} from './navbarFunctions';
import { getClassCategories } from '@src/app/class/class_categories/classCategorySlice';
import Init from '@src/Init';

export default function Navbar() {
  const location = useLocation();
  const { questions } = useSelector(selectQuestionState);
  const { topics } = useSelector(selectTopicState);
  const { exams } = useSelector(selectExamsState);
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
  const userIdRef = useRef(user.id);

  // spaces in stuff is a issue!!
  const { className, classId, groupName, groupId, questionId, schoolName, groupType, schoolId } =
    useSelector(selectNavbarState).navbar;

  function handlePageChange(e, data) {
    e.preventDefault();

    dispatch(changeNavbarPage(navigate, data.name));
    setSidebarOpened(false); // Close sidebar on item click
  }

  // Toggle sidebar
  const handleSidebarToggle = () => {
    setSidebarOpened(!sidebarOpened);
  };

  useEffect(() => {
    userIdRef.current = user.id;
  }, [user.id]); // keep userIdRef.current up to date with user.id

  useEffect(() => {
    const interval = setInterval(() => {
      if (userIdRef.current) {
        // cant use user.id here as it takes the user.id value and saves it for every callm, while useRef.current is a pointer to the value ( thats how I like to think ab it )
        dispatch(upsertTimeSpent()); // TODO TEST
      }
    }, 300000); // runs every 5 minute

    return () => clearInterval(interval);
  }, []);

  // get user at start of app
  useEffect(() => {
    if (!user?.id) {
      dispatch(getCurUser());
    } else if (user.id) {
      dispatch(getHasStreak());
    }
  }, [user.id]);

  ///  USE EFFECTS FOR KEEPING STORE SAME AS URL ///
  useEffect(() => {
    if (activePage?.includes('class') && !activePage?.includes('/auth?next') && !State401) {
      if (activePage?.includes('exam') && className && classId) {
        dispatch(updateGroupType('exam'));
      }
      if (activePage?.includes('topic') && className && classId) {
        dispatch(updateGroupType('topic'));
      }
      if (!loading?.ClassList) {
        dispatch(getClassCategories());
      }
      if (!loading?.SchoolsList) {
        schoolFetchLogic(dispatch, schools);
        schoolUpdateLogic(dispatch, schools, schoolName);
      }
      if (!loading?.ClassList) {
        classFetchLogic(dispatch, classes, schoolId);
        classUpdateLogic(dispatch, classes, className, schoolId);
      }
      if (!loading?.PDFlist && classId) {
        pdfsFetchLogic(dispatch, classId);
      }

      if (activePage?.includes('exam') && !loading?.ExamList && className && classId) {
        examUpdateLogic(dispatch, groupName, classId, exams);
        examFetchLogic(dispatch, classId);
      }
      if (activePage?.includes('topic') && !loading?.TopicsShow && className && classId) {
        topicUpdateLogic(dispatch, groupName, classId, topics);
        topicFetchLogic(dispatch, classId);
      }
      if (
        (activePage?.includes('exam') || activePage?.includes('topic')) &&
        activePage?.includes('question') &&
        !loading?.QuestionPage &&
        className &&
        classId &&
        groupId &&
        groupName &&
        groupType
      ) {
        questionUpdateLogic(dispatch, questionId);
        questionFetchLogic(dispatch, groupId);
      }
      if (
        (activePage?.includes('exam') || activePage?.includes('topic')) &&
        activePage?.includes('question') &&
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
    exams,
    topics,
    groupId,
    groupType,
    groupName,
    classes,
    schoolName,
    schools,
    schoolId,
    questionId,
    loading?.ClassList,
    loading?.ExamList,
    loading?.TopicsShow,
    loading?.QuestionPage,
    loading?.ChoiceRouter,
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
      {isMobile ? (
        <>
          <Menu fixed='top' inverted size='large' className='custom-navbar'>
            <Container>
              <Menu.Item onClick={handleSidebarToggle} className='sidebar-toggle'>
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
                href='/home'
                active={activePage === '/home'}
                name='/home'
                className='nav-item'
              >
                <Icon name='home' />
                Home
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
                  Login/Signup
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
              href='/home'
              active={activePage === '/home'}
              name='/home'
              className='nav-item'
            >
              <Icon name='home' />
              Home
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
                Login/Signup
              </Menu.Item>
            )}
          </Container>
        </Menu>
      )}
    </>
  );
}
