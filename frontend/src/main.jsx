import './globals.css';
import 'semantic-ui-css/semantic.min.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '@src/app/store/store.js';

import FlashMessage from '@components/flashmessage/FlashMessage.jsx';
import AppRouter from './app/AppRouter';
import Footer from '@components/Footer';

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
        <FlashMessage />
        <div style={{ flex: 1, paddingTop: '5.7em' }}>
          <AppRouter />
        </div>
        <Footer />
      </div>
    </Provider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
