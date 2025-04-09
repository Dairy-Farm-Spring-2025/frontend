import { Skeleton } from 'antd';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimationAppearProps {
  duration?: number;
  children: React.ReactNode;
  loading?: boolean;
}
const AnimationAppear = ({
  children,
  loading = false,
}: AnimationAppearProps) => {
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    if (!loading) {
      // Delay để Skeleton biến mất trơn tru trước khi animation
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [loading]);
  return (
    <Skeleton loading={loading}>
      {showContent && (
        <motion.div
          initial={{ y: 50, opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="box-border w-full"
        >
          {children}
        </motion.div>
      )}
    </Skeleton>
  );
};

export default AnimationAppear;
