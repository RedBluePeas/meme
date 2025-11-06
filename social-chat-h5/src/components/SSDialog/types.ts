/**
 * SSDialog 类型定义
 */

/**
 * 对话框配置接口
 */
export interface DialogOptions {
  /** 标题 */
  title?: string;
  /** 内容 */
  content: string | React.ReactNode;
  /** 确认按钮文字 */
  confirmText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 确认按钮颜色 */
  confirmColor?: 'primary' | 'success' | 'warning' | 'danger';
  /** 是否显示取消按钮 */
  showCancel?: boolean;
  /** 点击遮罩是否关闭 */
  closeOnOverlayClick?: boolean;
  /** 确认回调 */
  onConfirm?: () => void | Promise<void>;
  /** 取消回调 */
  onCancel?: () => void;
}

/**
 * Toast 配置接口
 */
export interface ToastOptions {
  /** 内容 */
  content: string;
  /** 类型 */
  type?: 'success' | 'error' | 'warning' | 'info';
  /** 显示时长（毫秒） */
  duration?: number;
  /** 图标 */
  icon?: string;
  /** 位置 */
  position?: 'top' | 'center' | 'bottom';
}

/**
 * Loading 配置接口
 */
export interface LoadingOptions {
  /** 提示文字 */
  text?: string;
  /** 是否允许点击遮罩关闭 */
  closeOnOverlayClick?: boolean;
}

/**
 * Dialog 实例接口
 */
export interface DialogInstance {
  /** 关闭对话框 */
  close: () => void;
}
