/// <reference types="react" />
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
export declare const OpenModal: (options: ModalFuncProps) => void;
export declare const OpenDeleteConfirm: (options: ModalFuncProps) => void;
export declare const OpenConfirm: (options: ModalFuncProps) => void;
export {};
