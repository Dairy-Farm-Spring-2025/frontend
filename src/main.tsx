import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.tsx';
import { persistor, store } from './core/store/store.ts';
import './index.scss';
import './config/i18n';
import { Suspense } from 'react';

createRoot(document.getElementById('root')!).render(
  <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'rgb(22 101 52 / var(--tw-bg-opacity, 1))',
          fontFamily: 'Nunito',
        },
      }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Suspense fallback={<div>Loading...</div>}>
            <App />
          </Suspense>
        </PersistGate>
      </Provider>
    </ConfigProvider>
    <Toaster reverseOrder={false} />
  </>
);
