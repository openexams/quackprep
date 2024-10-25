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
  getTopicIdbyClassNameAndTopicName,
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
import { getTopicsByClassId } from '@src/app/class/topic/topicSlice';
import { findNeedleInArrayOfObjectsLINEAR, findNeedlesInArrayOfObjectsLINEAR } from '@utils/functions';
import { selectTopicState } from '@src/app/class/topic/topicSlice';
import { selectQuestionState, getQuestionsByGroupId } from '@src/app/class/question/questionSlice';
import { getExamsByClassId, selectExamsState } from '@src/app/class/exam/examSlice.js';
import { replaceP20WithSpace } from '../../../../shared/globalFuncs';

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

  const { className, classId, groupName, groupId, questionId } = useSelector(selectNavbarState).navbar;

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
    if (activePage?.includes('exam') && !activePage?.includes('/auth?next')) {
      dispatch(updateGroupType('exam'));
    } else if (activePage?.includes('topic') && !activePage?.includes('/auth?next')) {
      dispatch(updateGroupType('topic'));
    }
  }, [activePage]);

  useEffect(() => {
    if (activePage?.includes('topic') && !activePage?.includes('/auth?next')) {
      console.count('topics');
      //TODO HOLY FUCK THIS SHIT IS AIDS COMMENT IT OR FIX IT
      // TOPICS DISPATCH
      const do_I_alr_have_a_topic_pulled_in_with_the_current_class_id = findNeedleInArrayOfObjectsLINEAR(
        topics,
        'class_id',
        classId,
        'id',
      );
      if (urlArr[4]) {
        urlArr[4] = replaceP20WithSpace(urlArr[4]);
      }
      let tmp_topic_id = null;
      if (activePage?.includes('topic') && classId && !do_I_alr_have_a_topic_pulled_in_with_the_current_class_id) {
        dispatch(getTopicsByClassId(classId));
      } else if (
        // i alr have topics for this class pulled in, as such find that topic id  and update cur group data
        urlArr[4] &&
        (tmp_topic_id = findNeedlesInArrayOfObjectsLINEAR(topics, ['name', 'class_id'], [urlArr[4], classId], 'id'))
      ) {
        dispatch(updateCurrentGroupData({ name: urlArr[4], id: tmp_topic_id }));
      } // } else if (urlArr[4] && !groupId) {
      //   console.log('FATAL ERROR');
      //   dispatch(getTopicIdbyClassNameAndTopicName(urlArr[4], className)); // already have this value in state dont dispatch retard
      // }
    }
  }, [activePage, classId, className, topics, groupId]); // why does topics watch itself [topic] may cause issue i remove it

  //EXAM
  useEffect(() => {
    if (activePage?.includes('exam') && !activePage?.includes('/auth?next')) {
      console.count('exam');
      const exams_pulled_in = findNeedleInArrayOfObjectsLINEAR(exams, 'class_id', classId, 'id');
      //console.log(exams_pulled_in);

      if (!exams_pulled_in && activePage?.includes('exam') && classId && className) {
        dispatch(getExamsByClassId(classId));
      } else if (exams_pulled_in !== null) {
        //console.log('updating current exam id', exams_pulled_in);
        dispatch(updateCurrentGroupData({ id: exams_pulled_in, name: urlArr[4] }));
      }
    }
  }, [activePage, classId, className, exams]);

  useEffect(() => {
    // what if exam?? TODO
    if (activePage?.includes('question') && !activePage?.includes('/auth?next')) {
      console.count('question');
      // QUESION DISPATCH
      if (urlArr[4]) {
        urlArr[4] = replaceP20WithSpace(urlArr[4]);
      }
      const do_I_alr_have_a_question_pulled_in_with_the_current_group_id = findNeedlesInArrayOfObjectsLINEAR(
        questions,
        ['group_id', 'type'],
        [groupId, urlArr[3]],
        'id',
      ); // same question may get pulled in twice once for exam once for topic
      if (groupId && !do_I_alr_have_a_question_pulled_in_with_the_current_group_id) {
        dispatch(getQuestionsByGroupId(groupId, urlArr[3])); // url[3] is type
      } else if (urlArr[6]) {
        dispatch(updateQuestionId(parseInt(urlArr[6])));
      }
    }

    //DISPATCHES EVEN IF I ALR HAVE TOPICS WITH THIS TOPIC ID LOADED IN.
  }, [activePage, groupId]);

  useEffect(() => {
    if (activePage?.includes('class') && !activePage?.includes('/auth?next')) {
      console.count('classes');

      // CLASSES DISPATCH MAIN THAT SETS OFF CHAIN OF REACTIONS
      let tmp_c_id = null;
      if (!classes && activePage?.includes('class')) {
        dispatch(getClasses());
      } else if (
        activePage?.includes('class') &&
        (tmp_c_id = findNeedleInArrayOfObjectsLINEAR(classes, 'name', urlArr[2], 'id')) !== null
      ) {
        dispatch(updateCurrentClassData({ name: urlArr[2], id: tmp_c_id }));
      } else if (activePage?.includes('class') && urlArr[2]) {
        dispatch(getClassIdByClassName(urlArr[2])); // updates id
      }
    }
  }, [activePage, classId, classes]); // if classId gets nulled then i need to get shit again

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
