import { motion } from 'framer-motion';

interface AnimationAppearProps {
  duration?: number;
  children: React.ReactNode;
}
const AnimationAppear = ({ children }: AnimationAppearProps) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0.5 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="box-border w-full"
    >
      {children}
    </motion.div>
  );
};

export default AnimationAppear;
