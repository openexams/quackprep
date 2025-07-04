import Home from './home/Home.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './profile/Profile.jsx';
import Streak from './streak/Streak.jsx';
import Leaderboard from './leaderboard/Leaderboard.jsx';
import Stats from './stats/Stats.jsx';
import QuestionPage from './class/question/QuestionPage.jsx';
import NotFoundPage from '@components/NotFound.jsx';
import CreatorDashboard from './creator/CreatorDashboard.jsx';
import ClassPage from './class/ClassPage.jsx';
import Comp401 from '@components/401/Comp401.jsx';
import HistoryNav from '@components/HistoryNav.jsx';
import PDFList from './class/group/pdf/PDFList.jsx';
import PDFShow from './class/group/pdf/PDFShow.jsx';
import GroupsList from './class/group/GroupsList.jsx';
import AboutPage from './about/About.jsx';
import Footer from '@components/Footer.jsx';
import ComingSoon from '@components/ComingSoon.jsx';
import TOS from './extra/TOS.jsx';
import PrivacyPolicy from './extra/Privacy.jsx';
import NewPageWrapper from './ai/create/Create.jsx';
import Init from './Init.jsx';
import Sentinel from './Sentinel.jsx';
import Layout from './layout/Layout.jsx';
import Auth from './auth/Auth.jsx';
import Announcement from './extra/Announcement.jsx';
import Test from './test/Test.jsx';
import ChatbotWidget from './chatbot/ChatbotWidget.jsx';
import Blog from './blog/Blog.jsx';

export default function AppRouter() {
  return (
    <Router>
      <Init />
      <Sentinel />
      <Comp401 />
      <Layout>
        <Announcement />
        <HistoryNav />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/test' element={<Test />} />
          <Route path='/learn' element={<ComingSoon />} />
          <Route path='/blog' element={<Blog />} />

          <Route path='/tos' element={<TOS />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/create' element={<NewPageWrapper />} />

          <Route path='/auth' element={<Auth />} />
          <Route path='/account' element={<Profile />} />
          <Route path='/streak' element={<Streak />} />
          <Route path='/class' element={<ClassPage />} />
          <Route path='/creatordashboard' element={<CreatorDashboard />} />
          <Route path='/class/:school_name/' element={<ClassPage />} />
          <Route path='/class/:school_name/:class_id/learn' element={<ComingSoon />} />

          <Route path='/class/:school_name/:class_id/group' element={<GroupsList />} />
          <Route path='/class/:school_name/:class_id/group/:group_id/question' element={<QuestionPage />} />
          <Route path='/class/:school_name/:class_id/group/:group_id/question/:question_id' element={<QuestionPage />} />

          <Route path='/class/:school_name/:class_id/pdfexams' element={<PDFList />} />
          <Route path='/class/:school_name/:class_id/pdfexams/:pdf_id' element={<PDFShow />} />

          <Route path='/leaderboard' element={<Leaderboard />} />
          <Route path='/stats' element={<Stats />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
        <Footer /> {/* can move out of layout and changes how it looks */}
      </Layout>
      <ChatbotWidget />
    </Router>
  );
}
