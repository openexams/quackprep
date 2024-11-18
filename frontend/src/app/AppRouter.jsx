import Home from './home/home.jsx';
import Navbar from '@components/navbar/Navbar';
import AuthPopup from '@src/app/auth/AuthPopup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './profile/Profile.jsx';
import Streak from './streak/Streak.jsx';
import Leaderboard from './leaderboard/Leaderboard.jsx';
import Stats from './stats/Stats.jsx';
import ClassShow from './class/ClassShow.jsx';
import QuestionPage from './class/question/QuestionPage.jsx';
import TopicsShow from './class/group/topic/TopicsList.jsx';
import NotFoundPage from '@components/NotFound.jsx';
import ExamList from './class/group/exam/ExamList.jsx';
import CreatorDashboard from './creator/CreatorDashboard.jsx';
import Create from './creator/Create.jsx';
import ClassPage from './class/ClassPage.jsx';

{
  /* topic could be a actual topic or a group of question such as a exam */
}

export default function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Routes style={{ flex: 1 }}>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/auth' element={<AuthPopup />} />
        <Route path='/account' element={<Profile />} />
        <Route path='/streak' element={<Streak />} />
        <Route path='/class' element={<ClassPage />} />
        <Route path='/creatordashboard' element={<CreatorDashboard />} />
        <Route path='/create' element={<Create />} />

        <Route path='/class/:school_name/' element={<ClassPage />} />

        <Route path='/class/:school_name/:class_name/' element={<ClassShow />} />

        <Route path='/class/:school_name/:class_name/topic' element={<TopicsShow />} />
        <Route path='/class/:school_name/:class_name/topic/:group_name/question' element={<QuestionPage />} />
        <Route path='/class/:school_name/:class_name/topic/:group_name/question/:question_id' element={<QuestionPage />} />

        <Route path='/class/:school_name/:class_name/exam' element={<ExamList />} />
        <Route path='/class/:school_name/:class_name/exam/:group_name/question' element={<QuestionPage />} />
        <Route path='/class/:school_name/:class_name/exam/:group_name/question/:question_id' element={<QuestionPage />} />

        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route path='/stats' element={<Stats />} />

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
