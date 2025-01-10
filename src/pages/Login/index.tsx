import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import backgroundImage from "../../assets/background.webp";
import { pageVariants } from "../../service/data/framer/framerLogin";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Render nothing initially to avoid flicker
  }
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5 }}
        className="w-[450px] p-10 bg-white shadow-2xl rounded-lg border border-gray-200"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default LoginPage;
