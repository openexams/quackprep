import { Menu, Container, Icon, Sidebar, Button } from 'semantic-ui-react';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@src/app/auth/authSlice';
import {
  changeNavbarPage,
  getClassIdByClassName,
  selectCurrentPage,
  selectNavbarState,
  updateCurrentClassData,
  updateCurrentGroupData,
  updateQuestionId,
  updateGroupType,
  upsertTimeSpent,
} from './navbarSlice';
import { getCurUser } from '@src/app/auth/authSlice';
import ProfileDropdown from './components/Profile/ProfileDropdown';
import { useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from './components/BrandLogo';
import { getHasStreak, selectHasStreak } from '@src/app/streak/streakSlice.js';
import { selectClassState } from '@src/app/class/classSlice';
import { getClasses } from '@src/app/class/classSlice';
import { getTopicsByClassId } from '@src/app/class//group/topic/topicSlice';
import { findNeedleInArrayOfObjectsLINEAR, findNeedlesInArrayOfObjectsLINEAR } from '@utils/functions';
import { selectTopicState } from '@src/app/class/group/topic/topicSlice';
import { selectQuestionState, getQuestionsByGroupId } from '@src/app/class/question/questionSlice';
import { getExamsByClassId, selectExamsState } from '@src/app/class/group/exam/examSlice.js';
import { replaceP20WithSpace } from '../../../../shared/globalFuncs';
import { selectSchoolState, getSchools } from '@src/app/class/school/schoolSlice';

export function examFetchLogic(dispatch, classId, className, exams, curGroupName) {
  console.count('exam');
  const exams_pulled_in = findNeedleInArrayOfObjectsLINEAR(exams, 'class_id', classId, 'id'); // can do this cuz class & name in groups make a unique field;
  const current_exam_id = findNeedlesInArrayOfObjectsLINEAR(exams, ['class_id', 'name'], [classId, curGroupName], 'id');
  // console.log(current_exam_id);
  if (!exams_pulled_in && classId && className) {
    dispatch(getExamsByClassId(classId));
  } else if (curGroupName && current_exam_id) {
    // console.log('updating current exam id', exams_pulled_in);
    dispatch(updateCurrentGroupData({ id: current_exam_id, name: curGroupName }));
  }
}

export function classFetchLogic(dispatch, schools, classes, curClassName, curSchoolName) {
  console.count('classes');
  if (!Array.isArray(schools)) {
    dispatch(getSchools());
  }
  const schoolId = findNeedleInArrayOfObjectsLINEAR(schools, 'school_name', curSchoolName, 'id');

  // CLASSES DISPATCH MAIN THAT SETS OFF CHAIN OF REACTIONS
  let tmp_c_id = null;
  if (!classes) {
    dispatch(getClasses());
  } else if (
    (tmp_c_id = findNeedlesInArrayOfObjectsLINEAR(classes, ['name', 'school_id'], [curClassName, schoolId], 'id')) !== null
  ) {
    dispatch(updateCurrentClassData({ name: curClassName, id: tmp_c_id }));
  } else if (curClassName) {
    dispatch(getClassIdByClassName(curClassName)); // updates id
  }
}

export function topicFetchLogic(dispatch, topics, classId, groupName) {
  console.count('topics');
  //TODO HOLY FUCK THIS SHIT IS AIDS COMMENT IT OR FIX IT
  // TOPICS DISPATCH
  const do_I_alr_have_a_topic_pulled_in_with_the_current_class_id = findNeedleInArrayOfObjectsLINEAR(
    topics,
    'class_id',
    classId,
    'id',
  );
  if (groupName) {
    groupName = replaceP20WithSpace(groupName);
  }
  let tmp_topic_id = null;
  if (classId && !do_I_alr_have_a_topic_pulled_in_with_the_current_class_id) {
    dispatch(getTopicsByClassId(classId));
  } else if (
    // i alr have topics for this class pulled in, as such find that topic id  and update cur group data
    groupName &&
    (tmp_topic_id = findNeedlesInArrayOfObjectsLINEAR(topics, ['name', 'class_id'], [groupName, classId], 'id')) // can do this cuz class & name in groups make a unique field;
  ) {
    dispatch(updateCurrentGroupData({ name: groupName, id: tmp_topic_id }));
  }
}

export function questionFetchLogic(dispatch, questions, groupId, curGroupName, curGroupType, curQuestionId) {
  console.count('question');
  // QUESION DISPATCH
  if (curGroupName) {
    curGroupName = replaceP20WithSpace(curGroupName);
  }
  const do_I_alr_have_a_question_pulled_in_with_the_current_group_id = findNeedlesInArrayOfObjectsLINEAR(
    questions,
    ['group_id', 'type'], // >
    [groupId, curGroupType], //I pass the type as well as when question are pulled in for one type, and the other type is loaded by the user, it may detect a question alr pulled in so then we will only have that single question when in reality the type had a lot more questions.
    'id',
  ); // same question may get pulled in twice once for exam once for topic
  if (groupId && !do_I_alr_have_a_question_pulled_in_with_the_current_group_id) {
    dispatch(getQuestionsByGroupId(groupId, curGroupType)); // url[3] is type
  } else if (curQuestionId) {
    dispatch(updateQuestionId(parseInt(curQuestionId)));
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

  const { className, classId, groupName, groupId, questionId, schoolName, groupType } = useSelector(selectNavbarState).navbar;

  const urlArr = useMemo(() => {
    return activePage ? activePage.split('/') : '/';
  }, [activePage]); // const url = location.pathname + location.search + location.hash only contructs once FATAL ERR MADDOX

  function handlePageChange(e, data) {
    e.preventDefault();
    dispatch(changeNavbarPage(data.name));
    setSidebarOpened(false); // Close sidebar on item click
  }

  // Toggle sidebar
  const handleSidebarToggle = () => {
    setSidebarOpened(!sidebarOpened);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (user.id) {
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
    if (!activePage?.includes('/auth?next')) {
      if (activePage?.includes('class')) {
        classFetchLogic(dispatch, schools, classes, urlArr[3], urlArr[2]);
      }
      if (urlArr[5]) {
        urlArr[5] = replaceP20WithSpace(urlArr[5]);
      }
      if (activePage?.includes('exam')) {
        examFetchLogic(dispatch, classId, className, exams, urlArr[5]);
        dispatch(updateGroupType('exam'));
      }
      if (activePage?.includes('topic')) {
        topicFetchLogic(dispatch, topics, classId, urlArr[5]);
        dispatch(updateGroupType('topic'));
      }
      if (activePage?.includes('question')) {
        questionFetchLogic(dispatch, questions, groupId, urlArr[5], urlArr[4], urlArr[7]);
      }
    }
  }, [activePage, classId, className, exams, topics, groupId, groupName, groupType, classes, schoolName]);

  ///  ************************************* ///

  useEffect(() => {
    navigate(activePage);
    const handlePopState = (event) => {
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
    dispatch(changeNavbarPage(location.pathname + location.search + location.hash));
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
          <Menu fixed='top' inverted>
            <Container>
              <Menu.Item onClick={handleSidebarToggle}>
                <Icon name='sidebar' />
              </Menu.Item>
              <BrandLogo handlePageChange={handlePageChange} />
            </Container>
          </Menu>

          <Sidebar as={Menu} animation='overlay' inverted vertical visible={sidebarOpened} onHide={() => setSidebarOpened(false)}>
            <Menu.Item onClick={handlePageChange} as='a' href='/home' active={activePage === '/home'} name='/home'>
              Home
            </Menu.Item>
            <Menu.Item
              onClick={handlePageChange}
              as='a'
              href='/leaderboard'
              active={activePage === '/leaderboard'}
              name='/leaderboard'
            >
              Leaderboard
            </Menu.Item>
            <Menu.Item onClick={handlePageChange} as='a' href='/stats' active={activePage === '/stats'} name='/stats'>
              Stats
            </Menu.Item>

            {user.id ? (
              <Menu.Item>
                <ProfileDropdown hasStreak={hasStreak} activePage={activePage} handlePageChange={handlePageChange} />
              </Menu.Item>
            ) : (
              <Menu.Item onClick={handlePageChange} as='a' href='/auth' active={activePage === '/auth'} name='/auth'>
                Login/Signup
              </Menu.Item>
            )}
          </Sidebar>
        </>
      ) : (
        <Menu fixed='top' inverted>
          <Container>
            <BrandLogo handlePageChange={handlePageChange} />
            <Menu.Item onClick={handlePageChange} as='a' href='/home' active={activePage === '/home'} name='/home'>
              Home
            </Menu.Item>
            <Menu.Item
              onClick={handlePageChange}
              as='a'
              href='/leaderboard'
              active={activePage === '/leaderboard'}
              name='/leaderboard'
            >
              Leaderboard
            </Menu.Item>
            <Menu.Item onClick={handlePageChange} as='a' href='/stats' active={activePage === '/stats'} name='/stats'>
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
              >
                Login/Signup
              </Menu.Item>
            )}
          </Container>
        </Menu>
      )}
    </>
  );
}
