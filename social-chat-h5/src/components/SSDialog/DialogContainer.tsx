/**
 * DialogContainer - 对话框容器组件
 */

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { DialogOptions } from './types';

interface DialogContainerProps extends DialogOptions {
  isOpen: boolean;
  onClose: () => void;
}

export const DialogContainer: React.FC<DialogContainerProps> = ({
  isOpen,
  onClose,
  title,
  content,
  confirmText = '确定',
  cancelText = '取消',
  confirmColor = 'primary',
  showCancel = true,
  closeOnOverlayClick = true,
  onConfirm,
  onCancel
}) => {
  /**
   * 处理确认按钮点击
   */
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onClose();
  };

  /**
   * 处理取消按钮点击
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={closeOnOverlayClick}
      placement="center"
      classNames={{
        base: 'mx-4',
        backdrop: 'bg-black/50'
      }}
    >
      <ModalContent>
        {() => (
          <>
            {title && (
              <ModalHeader className="flex flex-col gap-1 text-lg font-semibold">
                {title}
              </ModalHeader>
            )}
            <ModalBody className="py-4">
              {typeof content === 'string' ? (
                <p className="text-gray-700 dark:text-gray-300">{content}</p>
              ) : (
                content
              )}
            </ModalBody>
            <ModalFooter className="gap-2">
              {showCancel && (
                <Button
                  variant="light"
                  onPress={handleCancel}
                >
                  {cancelText}
                </Button>
              )}
              <Button
                color={confirmColor}
                onPress={handleConfirm}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
