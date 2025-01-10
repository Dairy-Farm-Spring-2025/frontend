import { AnimatePresence } from "framer-motion";
import AppRouting from "./config/routes/AppRouting";

function App() {
  return (
    <AnimatePresence mode="wait">
      <AppRouting />
    </AnimatePresence>
  );
}

export default App;
