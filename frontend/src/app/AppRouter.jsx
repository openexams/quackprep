import Home from './home/home.jsx';
import Navbar from '@components/navbar/Navbar';
import AuthPopup from '@src/app/auth/AuthPopup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './profile/Profile.jsx';
import Streak from './streak/Streak.jsx';
import ClassList from './class/ClassList.jsx';
import Leaderboard from './leaderboard/Leaderboard.jsx';
import Stats from './stats/Stats.jsx';
import ClassShow from './class/ClassShow.jsx';
import QuestionPage from './class/topic/question/QuestionPage.jsx';
import TopicsShow from './class/topic/TopicsShow.jsx';

{
  /* topic could be a actual topic or a group of question such as a exam */
}

export default function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/auth' element={<AuthPopup />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/streak' element={<Streak />} />
        <Route path='/class' element={<ClassList />} />
        <Route path='/class/:class_name/' element={<ClassShow />} />
        <Route path='/class/:class_name/topic/' element={<TopicsShow />} />
        <Route path='/class/:class_name/topic/:topic_name/question' element={<QuestionPage />} />
        <Route path='/class/:class_name/topic/:topic_name/question/:question_id' element={<QuestionPage />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route path='/stats' element={<Stats />} />
      </Routes>
    </Router>
  );
}
