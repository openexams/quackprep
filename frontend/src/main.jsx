import './globals.css';
import 'semantic-ui-css/semantic.min.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '@app/store/store.js';

import FlashMessage from '@components/flashmessage/FlashMessage.jsx';
import AppRouter from '@app/AppRouter';
import DarkModeWidget from '@components/DarkMode.jsx';

export default function Main() {
  return (
    <Provider store={store}>
      <FlashMessage />
      <DarkModeWidget />
      <AppRouter />
    </Provider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
