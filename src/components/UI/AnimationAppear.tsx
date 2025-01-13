import { motion } from "framer-motion";

interface AnimationAppearProps {
  duration?: number;
  children: React.ReactNode;
}
const AnimationAppear = ({ duration = 1, children }: AnimationAppearProps) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0.7 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: duration }}
    >
      {children}
    </motion.div>
  );
};

export default AnimationAppear;
