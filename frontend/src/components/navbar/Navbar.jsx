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
  updateCurrentTopicData,
  updateQuestionId,
  getTopicIdbyClassNameAndTopicName,
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
import { selectQuestionState, getQuestionsByTopic } from '@src/app/class/topic/question/questionSlice';

export default function Navbar() {
  const location = useLocation();
  const { questions } = useSelector(selectQuestionState);
  const { topics } = useSelector(selectTopicState);
  const { classes } = useSelector(selectClassState);
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const { hasStreak } = useSelector(selectHasStreak);
  const { page: activePage } = useSelector(selectCurrentPage);
  const navigate = useNavigate();
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { className, classId, topicName, topicId, questionId } = useSelector(selectNavbarState).navbar;

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
    console.count('topics');

    // TOPICS DISPATCH
    const do_I_alr_have_a_topic_pulled_in_with_the_current_class_id = findNeedleInArrayOfObjectsLINEAR(
      topics,
      'class_id',
      classId,
      'id',
    );
    let tmp_topic_id = null;
    if (activePage?.includes('topic') && classId && !do_I_alr_have_a_topic_pulled_in_with_the_current_class_id) {
      dispatch(getTopicsByClassId(classId));
    } else if (
      urlArr[4] &&
      (tmp_topic_id = findNeedlesInArrayOfObjectsLINEAR(topics, ['name', 'class_id'], [urlArr[4], classId], 'id'))
    ) {
      dispatch(updateCurrentTopicData({ name: urlArr[4], id: tmp_topic_id }));
    } else if (urlArr[4]) {
      dispatch(getTopicIdbyClassNameAndTopicName(urlArr[4], className)); // already have this value in state dont dispatch retard
    }
  }, [activePage, classId, className, topics]);

  useEffect(() => {
    console.count('question');
    // QUESION DISPATCH
    const do_I_alr_have_a_question_pulled_in_with_the_current_topic_id = findNeedleInArrayOfObjectsLINEAR(
      questions,
      'topic_id',
      topicId,
      'id',
    );
    if (activePage?.includes('question') && topicId && !do_I_alr_have_a_question_pulled_in_with_the_current_topic_id) {
      dispatch(getQuestionsByTopic(topicId));
      console.log('get questions by topic id');
    } else if (urlArr[6]) {
      dispatch(updateQuestionId(parseInt(urlArr[6])));
    }
    //DISPATCHES EVEN IF I ALR HAVE TOPICS WITH THIS TOPIC ID LOADED IN.
  }, [activePage, topicId]);

  useEffect(() => {
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
  }, [activePage, classId, classes]); // if classId gets nulled then i need to get shit again

  ///  ************************************* ///

  useEffect(() => {
    navigate(activePage);
    const handlePopState = (event) => {
      console.log('Back or forward button clicked');
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
