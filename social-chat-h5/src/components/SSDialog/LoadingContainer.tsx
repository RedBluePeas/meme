/**
 * LoadingContainer - 加载中容器组件
 */

import { Spinner } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingOptions } from './types';

interface LoadingContainerProps extends LoadingOptions {
  isVisible: boolean;
  onClose: () => void;
}

export const LoadingContainer: React.FC<LoadingContainerProps> = ({
  isVisible,
  text = '加载中...',
  closeOnOverlayClick = false,
  onClose
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={closeOnOverlayClick ? onClose : undefined}
        >
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
          />

          {/* Loading内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="relative bg-gray-800/90 text-white px-8 py-6 rounded-lg shadow-lg"
          >
            <div className="flex flex-col items-center gap-3">
              <Spinner color="white" size="lg" />
              {text && <p className="text-sm">{text}</p>}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
