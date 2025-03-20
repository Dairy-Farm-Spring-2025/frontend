import { ConfigProvider, Spin } from 'antd';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.tsx';
import { persistor, store } from './core/store/store.ts';
import './index.scss';
import './config/i18n';
import { Suspense } from 'react';
import { SiHappycow } from 'react-icons/si';
import '@xyflow/react/dist/style.css';

createRoot(document.getElementById('root')!).render(
  <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'rgb(22 101 52 / var(--tw-bg-opacity, 1))',
          fontFamily: 'Nunito',
        },
        components: {
          Select: {
            optionSelectedBg: 'rgba(22, 101, 52, 0.1)', // ✅ Điều chỉnh nền mục đã chọn
          },
          Menu: {
            itemSelectedBg: 'rgba(22, 101, 52, 0.1)',
          },
        },
      }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Suspense
            fallback={
              <div className="w-screen h-screen flex flex-col justify-center items-center">
                <div
                  className={`bg-white p-3 flex  gap-4 justify-center items-center`}
                >
                  <SiHappycow className="text-green-900" size={52} />
                  <p className="text-2xl font-bold text-black">Dairy Farm</p>
                </div>
                <Spin size="large" />
              </div>
            }
          >
            <App />
          </Suspense>
        </PersistGate>
      </Provider>
    </ConfigProvider>
    <Toaster reverseOrder={false} />
  </>
);
