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
   * Toast 提示
   */
  toast = {
    show: (options: ToastOptions): DialogInstance => {
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
    },

    success: (content: string, duration?: number): DialogInstance => {
      return SSDialogService.prototype.toast.show({
        content,
        type: 'success',
        duration
      });
    },

    error: (content: string, duration?: number): DialogInstance => {
      return SSDialogService.prototype.toast.show({
        content,
        type: 'error',
        duration
      });
    },

    warning: (content: string, duration?: number): DialogInstance => {
      return SSDialogService.prototype.toast.show({
        content,
        type: 'warning',
        duration
      });
    },

    info: (content: string, duration?: number): DialogInstance => {
      return SSDialogService.prototype.toast.show({
        content,
        type: 'info',
        duration
      });
    }
  };

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
