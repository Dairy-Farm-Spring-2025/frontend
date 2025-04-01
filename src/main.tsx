import '@xyflow/react/dist/style.css';
import { ConfigProvider, Spin } from 'antd';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { SiHappycow } from 'react-icons/si';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.tsx';
import './config/i18n';
import { persistor, store } from '@core/store/store.ts';
import './index.scss';
import { PRIMARY_COLORS } from '@common/colors.js';

createRoot(document.getElementById('root')!).render(
  <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PRIMARY_COLORS,
          fontFamily: 'Nunito',
        },
        components: {
          Select: {
            optionSelectedBg: 'rgba(22, 101, 52, 0.1)', // ✅ Điều chỉnh nền mục đã chọn
            colorTextDisabled: 'black',
          },
          Menu: {
            itemSelectedBg: 'rgba(22, 101, 52, 0.1)',
          },
          Input: {
            colorTextDisabled: 'black',
          },
          InputNumber: {
            colorTextDisabled: 'black',
          },
          Table: {
            rowSelectedBg: 'rgba(22, 101, 52, 0.1)',
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
