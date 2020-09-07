import React from 'react';
import { OpenDeleteConfirm } from "../modal";
declare type IConfirmOpions<T> = Parameters<typeof OpenDeleteConfirm>[0] & {
    logger?: (option: {
        error?: Error;
        that: T;
    }) => void;
    /** 对话框类型
     *
     * delete 删除确认对话框
     *
     * confirm 确认对话框
     *
     * message 信息提示对话框
     */
    confirmType: 'delete' | 'confirm' | 'message';
};
declare type messageType = 'success' | 'error' | 'warning' | 'info';
declare type messageTypefunc<T> = (that: T) => messageType;
declare type reactNodeType<T> = (that: T) => React.ReactNode;
interface ICoverConfirm<T> {
    onCancel?: (that: T) => void;
    type?: messageType | messageTypefunc<T>;
    title?: string | reactNodeType<T>;
    content?: string | reactNodeType<T>;
}
/** 对话框修饰器 */
export declare function confirmAnnotation<T = {}>(options: Omit<IConfirmOpions<T>, 'onOk' | 'onCancel' | 'type' | 'title' | 'content'> & ICoverConfirm<T>): (target: any, key: any, descriptor: any) => any;
export {};
