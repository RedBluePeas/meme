/**
 * App - 应用主组件
 */

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import { Provider } from 'react-redux';
import { router } from './router';
import { store } from './store';
import { setOnlineStatus, setTheme } from './store/slices/appSlice';

function App() {
  useEffect(() => {
    // 初始化主题
    const theme = store.getState().app.theme;
    store.dispatch(setTheme(theme));

    // 监听在线/离线状态
    const handleOnline = () => store.dispatch(setOnlineStatus(true));
    const handleOffline = () => store.dispatch(setOnlineStatus(false));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 监听系统主题变化（当主题设置为auto时）
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => {
      if (store.getState().app.theme === 'auto') {
        store.dispatch(setTheme('auto'));
      }
    };

    darkModeQuery.addEventListener('change', handleThemeChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      darkModeQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  return (
    <Provider store={store}>
      <HeroUIProvider>
        <RouterProvider router={router} />
      </HeroUIProvider>
    </Provider>
  );
}

export default App;
