/**
 * ToastContainer - Toast 提示容器组件
 */

import { AnimatePresence, motion } from 'framer-motion';
import { ToastOptions } from './types';

interface ToastContainerProps extends ToastOptions {
  isVisible: boolean;
}

const TYPE_ICONS: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ'
};

const TYPE_COLORS: Record<string, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-orange-500',
  info: 'bg-blue-500'
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  isVisible,
  content,
  type = 'info',
  icon,
  position = 'center'
}) => {
  const positionClasses = {
    top: 'top-20',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-20'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className={`fixed left-1/2 -translate-x-1/2 ${positionClasses[position]} z-[9999] pointer-events-none`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`
              ${TYPE_COLORS[type]}
              text-white px-6 py-3 rounded-lg shadow-lg
              max-w-xs mx-4 pointer-events-auto
            `}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none">
                {icon || TYPE_ICONS[type]}
              </span>
              <span className="text-sm font-medium">{content}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
