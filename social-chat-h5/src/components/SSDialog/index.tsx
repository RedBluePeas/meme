/**
 * SSDialog - 统一对话框服务 (Social chat Service Dialog)
 * 提供 confirm、alert、toast、loading 等对话框功能
 *
 * @example
 * // 确认对话框
 * SSDialog.confirm({
 *   title: '删除确认',
 *   content: '确定要删除这条动态吗？',
 *   onConfirm: async () => {
 *     await deletePost();
 *   }
 * });
 *
 * // 提示对话框
 * SSDialog.alert({
 *   title: '提示',
 *   content: '操作成功'
 * });
 *
 * // Toast提示
 * SSDialog.toast.success('操作成功');
 * SSDialog.toast.error('操作失败');
 *
 * // 加载中
 * const loading = SSDialog.loading('加载中...');
 * await fetchData();
 * loading.close();
 */

import { createRoot } from 'react-dom/client';
import { DialogContainer } from './DialogContainer';
import { ToastContainer } from './ToastContainer';
import { LoadingContainer } from './LoadingContainer';
import { DialogOptions, ToastOptions, LoadingOptions, DialogInstance } from './types';

class SSDialogService {
  /**
   * Toast 提示对象
   */
  public toast: {
    show: (options: ToastOptions) => DialogInstance;
    success: (content: string, duration?: number) => DialogInstance;
    error: (content: string, duration?: number) => DialogInstance;
    warning: (content: string, duration?: number) => DialogInstance;
    info: (content: string, duration?: number) => DialogInstance;
  };

  constructor() {
    // 在构造函数中初始化 toast，确保 this 绑定正确
    this.toast = {
      show: (options: ToastOptions): DialogInstance => {
        return this.showToast(options);
      },

      success: (content: string, duration?: number): DialogInstance => {
        return this.showToast({
          content,
          type: 'success',
          duration
        });
      },

      error: (content: string, duration?: number): DialogInstance => {
        return this.showToast({
          content,
          type: 'error',
          duration
        });
      },

      warning: (content: string, duration?: number): DialogInstance => {
        return this.showToast({
          content,
          type: 'warning',
          duration
        });
      },

      info: (content: string, duration?: number): DialogInstance => {
        return this.showToast({
          content,
          type: 'info',
          duration
        });
      }
    };
  }

  /**
   * 确认对话框
   */
  confirm(options: DialogOptions): DialogInstance {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const close = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    root.render(
      <DialogContainer
        {...options}
        isOpen={true}
        onClose={close}
        showCancel={true}
      />
    );

    return { close };
  }

  /**
   * 提示对话框（无取消按钮）
   */
  alert(options: DialogOptions): DialogInstance {
    return this.confirm({
      ...options,
      showCancel: false
    });
  }

  /**
   * Toast 提示 - 基础方法
   */
  private showToast(options: ToastOptions): DialogInstance {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const close = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    root.render(
      <ToastContainer
        {...options}
        isVisible={true}
      />
    );

    // 自动关闭
    const duration = options.duration || 2000;
    setTimeout(close, duration);

    return { close };
  }

  /**
   * 加载中对话框
   */
  loading(text?: string, options?: LoadingOptions): DialogInstance {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const close = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    root.render(
      <LoadingContainer
        {...options}
        text={text}
        isVisible={true}
        onClose={close}
      />
    );

    return { close };
  }
}

/**
 * 导出单例
 */
export const SSDialog = new SSDialogService();

/**
 * 导出类型
 */
export type { DialogOptions, ToastOptions, LoadingOptions, DialogInstance };
