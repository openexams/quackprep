// not using navbar css file
import { Menu, Container, Icon, Sidebar, Button, Transition } from 'semantic-ui-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@src/app/auth/authSlice';
import {
  changeNavbarPage,
  selectCurrentPage,
  selectNavbarState,
  updateCurrentClassData,
  updateCurrentGroupData,
  updateQuestionId,
  updateGroupType,
  upsertTimeSpent,
  updateSchoolId,
  updateLastPage,
} from './navbarSlice';
import { getCurUser } from '@src/app/auth/authSlice';
import ProfileDropdown from './components/Profile/ProfileDropdown';
import { useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from './components/BrandLogo';
import { getHasStreak, selectHasStreak } from '@src/app/streak/streakSlice.js';
import { selectClassState, getClasses } from '@src/app/class/classSlice';
import { getTopicsByClassId } from '@src/app/class//group/topic/topicSlice';
import { findNeedleInArrayOfObjectsLINEAR, findNeedlesInArrayOfObjectsLINEAR } from '@utils/functions';
import { selectTopicState } from '@src/app/class/group/topic/topicSlice';
import { selectQuestionState, getQuestionsByGroupId } from '@src/app/class/question/questionSlice';
import { getExamsByClassId, selectExamsState } from '@src/app/class/group/exam/examSlice.js';
import { replaceP20WithSpace } from '../../../../shared/globalFuncs';
import { selectSchoolState, getSchools } from '@src/app/class/school/schoolSlice';
import { selectChoicesState } from '@src/app/class/question/choices/choicesSlice';
import { getChoicesByGroup } from '@src/app/class/question/choices/choicesSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import { select401CompState } from '@components/401/401Slice';

export function classFetchLogic(dispatch, classes) {
  if (!Array.isArray(classes)) {
    dispatch(getClasses());
  }
}

export function classUpdateLogic(dispatch, classes, curClassName) {
  const tmp_c_id = findNeedleInArrayOfObjectsLINEAR(classes, 'name', curClassName, 'id');
  dispatch(updateCurrentClassData({ name: curClassName, id: tmp_c_id }));
}

// fetches all schools
export function schoolFetchLogic(dispatch, schools) {
  if (!Array.isArray(schools)) {
    dispatch(getSchools());
  }
}
export function schoolUpdateLogic(dispatch, schools, school_name) {
  const schoolId = findNeedleInArrayOfObjectsLINEAR(schools, 'school_name', school_name, 'id');
  if (schoolId) {
    dispatch(updateSchoolId(schoolId));
  }
}

export function topicUpdateLogic(dispatch, groupName, class_id, topics) {
  const tmp_topic_id = findNeedlesInArrayOfObjectsLINEAR(topics, ['name', 'class_id'], [groupName, class_id], 'id');
  if ((tmp_topic_id, groupName)) {
    dispatch(updateCurrentGroupData({ name: groupName, id: tmp_topic_id }));
  }
}

export function topicFetchLogic(dispatch, classId) {
  if (classId) {
    dispatch(getTopicsByClassId(classId));
  }
}

export function examUpdateLogic(dispatch, groupName, class_id, exams) {
  const current_exam_id = findNeedlesInArrayOfObjectsLINEAR(exams, ['class_id', 'name'], [class_id, groupName], 'id');
  if (groupName && current_exam_id) {
    dispatch(updateCurrentGroupData({ id: current_exam_id, name: groupName }));
  }
}

export function examFetchLogic(dispatch, classId) {
  if (classId) {
    dispatch(getExamsByClassId(classId));
  }
}

export function questionUpdateLogic(dispatch, question_id) {
  if (question_id) {
    dispatch(updateQuestionId(parseInt(question_id)));
  }
}

export function questionFetchLogic(dispatch, groupId) {
  if (groupId) {
    dispatch(getQuestionsByGroupId(groupId));
  }
}

export function choicesFetchLogic(dispatch, groupName, groupId) {
  if (groupName && groupId) {
    dispatch(getChoicesByGroup(groupId));
  }
}

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
  const choices = useSelector(selectChoicesState).choices;
  const loading = useSelector(selectLoadingState)?.loadingComps;
  const State401 = useSelector(select401CompState).show;
  const userIdRef = useRef(user.id);

  const { className, classId, groupName, groupId, questionId, schoolName, groupType, schoolId, fetchHistory } =
    useSelector(selectNavbarState).navbar;

  const urlArr = useMemo(() => {
    return activePage ? activePage.split('/') : '/';
  }, [activePage]);

  function handlePageChange(e, data) {
    e.preventDefault();
    dispatch(updateLastPage(activePage));
    dispatch(changeNavbarPage(data.name));
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
    if (urlArr[5]) {
      urlArr[5] = replaceP20WithSpace(urlArr[5]);
    }
    if (!activePage?.includes('/auth?next') && !State401 && !fetchHistory[activePage]) {
      if (activePage?.includes('class') && !loading?.SchoolsList) {
        schoolFetchLogic(dispatch, schools);
      }
      if (activePage?.includes('class') && !loading?.ClassList) {
        classFetchLogic(dispatch, classes);
      }

      if (activePage?.includes('exam') && !loading?.ExamList && className && classId) {
        examFetchLogic(dispatch, classId);
      }
      if (activePage?.includes('topic') && !loading?.TopicsShow && className && classId) {
        topicFetchLogic(dispatch, classId);
      }
      if (activePage?.includes('question') && !loading?.QuestionPage && className && classId && groupId && urlArr[5]) {
        questionFetchLogic(dispatch, groupId);
      }
      if (
        user &&
        activePage?.includes('question/') &&
        !loading?.ChoiceRouter &&
        className &&
        classId &&
        groupId &&
        urlArr[5] &&
        groupName &&
        groupType &&
        questions
      ) {
        choicesFetchLogic(dispatch, groupName, groupId);
      }
    }
    if (!activePage?.includes('/auth?next') && !State401) {
      if (activePage?.includes('class') && !loading?.SchoolsList) {
        schoolUpdateLogic(dispatch, schools, schoolName);
      }
      if (activePage?.includes('class') && !loading?.ClassList) {
        classUpdateLogic(dispatch, classes, className);
      }

      if (activePage?.includes('exam') && !loading?.ExamList && className && classId) {
        examUpdateLogic(dispatch, groupName, classId, exams);
        dispatch(updateGroupType('exam'));
      }
      if (activePage?.includes('topic') && !loading?.TopicsShow && className && classId) {
        topicUpdateLogic(dispatch, groupName, classId, topics);
        dispatch(updateGroupType('topic'));
      }
      if (activePage?.includes('question') && !loading?.QuestionPage && className && classId && groupId && urlArr[5]) {
        questionUpdateLogic(dispatch, questionId);
      }
    }
  }, [
    activePage,
    classId,
    className,
    exams,
    topics,
    groupId,
    groupName,
    groupType,
    classes,
    schoolName,
    schools,
    urlArr,
    schoolId,
    questionId,
    loading?.ClassList,
    loading?.ExamList,
    loading?.TopicsShow,
    loading?.QuestionPage,
    loading?.ChoiceRouter,
  ]);

  ///  ************************************* ///

  useEffect(() => {
    navigate(activePage);
    const handlePopState = (event) => {
      const curPage = location.pathname + location.search + location.hash;
      //console.log('Back or forward button clicked');
      dispatch(changeNavbarPage(location.pathname + location.search + location.hash));
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activePage]);

  useEffect(() => {
    //console.log('init the navbar page store');
    const curPage = location.pathname + location.search + location.hash;
    dispatch(changeNavbarPage(curPage));
  }, []);

  // Detect if mobile view
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
