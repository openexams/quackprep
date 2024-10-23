import './globals.css';
import 'semantic-ui-css/semantic.min.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '@src/app/store/store.js';

import FlashMessage from '@components/flashmessage/FlashMessage.jsx';
import AppRouter from './app/AppRouter';
import HistoryNav from '@components/Breadcrumb';
import Footer from '@components/Footer';
import Comp401 from '@components/401/Comp401';

export default function Main() {
  return (
    <Provider store={store}>
      <div
        className='ui pusher'
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Comp401 />
        <FlashMessage />
        <HistoryNav />
        <div style={{ flex: 1, paddingTop: '5.6em' }}>
          <AppRouter />
        </div>
        <Footer />
      </div>
    </Provider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
