import './globals.css';
import 'semantic-ui-css/semantic.min.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '@src/app/store/store.js';

import FlashMessage from '@components/flashmessage/FlashMessage.jsx';
import AppRouter from './app/AppRouter';
import HistoryNav from '@components/Breadcrumb';

export default function Main() {
  return (
    <Provider store={store}>
      <div className='ui pusher' style={{ marginTop: '5.6em' }}>
        <FlashMessage />
        <HistoryNav />
        <AppRouter />
      </div>
    </Provider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
