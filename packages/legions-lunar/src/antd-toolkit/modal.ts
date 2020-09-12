import { Modal } from 'antd';
export declare type ButtonType = 'primary' | 'ghost' | 'dashed' | 'danger';
interface ModalFuncProps {
  visible?: boolean;
  title?: React.ReactNode | string;
  content?: React.ReactNode | string;
  onOk?: () => any;
  onCancel?: () => any;
  width?: string | number;
  iconClassName?: string;
  okText?: string;
  okType?: ButtonType;
  cancelText?: string;
  iconType?: string;
  maskClosable?: boolean;
  zIndex?: number;
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirm';
}
export const OpenModal = (options: ModalFuncProps) => {
  //信息提示样式
  options.type = options.type || 'success';
  const ref = Modal[options.type]({
    title: options.title || '',
    content: options.content || '',
    onOk: () => {
      options.onOk && options.onOk();
      ref.destroy();
    },
  });
};
export const OpenDeleteConfirm = (options: ModalFuncProps) => {
  const ref = Modal.confirm({
    title: (options && options.title) || '删除',
    content: (options && options.content) || '您确认删除选中数据吗？',
    okText: (options && options.okText) || '确认',
    okType: (options && options.okType) || 'danger',
    cancelText: (options && options.cancelText) || '取消',
    onOk: () => {
      options.onOk && options.onOk();
      ref.destroy();
    },
    onCancel() {
      options.onCancel && options.onCancel();
      ref.destroy();
    },
  });
};
export const OpenConfirm = (options: ModalFuncProps) => {
  const ref = Modal.confirm({
    title: options.title || 'confirm',
    content: options.content,
    okText: options.okText || '确认',
    okType: options.okType || 'danger',
    cancelText: options.cancelText || '取消',
    onOk: () => {
      options.onOk && options.onOk();
      ref.destroy();
    },
    onCancel() {
      options.onCancel && options.onCancel();
      ref.destroy();
    },
  });
};
