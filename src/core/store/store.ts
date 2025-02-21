import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './slice/userSlice';
import avatarReducer from './slice/avatarSlice';
import mutateReducer from './slice/mutateSlice';
import functionReducer from './slice/functionSlice';
import itemManagementReducer from './slice/itemManagementSlice';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['itemManagement'], // Không lưu itemManagement
};

const rootReducer = combineReducers({
  user: userReducer,
  avatar: avatarReducer,
  mutate: mutateReducer,
  function: functionReducer,
  itemManagement: itemManagementReducer, // Không áp dụng persist
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
