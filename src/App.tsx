import { AnimatePresence } from 'framer-motion';
import AppRouting from './config/routes/AppRouting';
import { useNetworkStatus } from '@hooks/useNetworkStatus';

function App() {
  useNetworkStatus();

  return (
    <AnimatePresence mode="wait">
      <AppRouting />
    </AnimatePresence>
  );
}

export default App;
