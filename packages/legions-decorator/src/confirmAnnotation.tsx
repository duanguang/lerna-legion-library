import React from 'react';
import { OpenDeleteConfirm,OpenConfirm,OpenModal } from "../modal";

type IConfirmOpions<T> = Parameters<typeof OpenDeleteConfirm>[0] & {
    logger?: (option: { error?: Error,that: T }) => void;
    /** 对话框类型
     * 
     * delete 删除确认对话框
     * 
     * confirm 确认对话框
     * 
     * message 信息提示对话框
     */
    confirmType: 'delete' | 'confirm' | 'message'
}
type messageType = 'success' | 'error' | 'warning' | 'info'
type messageTypefunc<T> = (that: T) => messageType
type reactNodeType<T> = (that: T) => React.ReactNode
interface ICoverConfirm<T> {
    onCancel?: (that: T) => void;
    type?: messageType | messageTypefunc<T>;
    title?: string | reactNodeType<T>;
    content?: string | reactNodeType<T>;
}
/** 对话框修饰器 */
export function confirmAnnotation<T = {}>(options: Omit<IConfirmOpions<T>,'onOk' | 'onCancel' | 'type' | 'title' | 'content'> & ICoverConfirm<T>) {
    return (target,key,descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = function (...rest) {
            const that = this;
            try {
                options['onOk'] = () => {
                    oldValue.apply(this,rest);
                    options.logger && options.logger.call(this,{
                        that,
                    })
                }
                if (options.confirmType !== 'message') {
                    if (options['onCancel']) {
                        const onCancel = options['onCancel'].bind(that);
                        options['onCancel'] = () => {
                            onCancel(that);
                        }
                    }
                }
                if (options.type && typeof options.type === 'function') {
                    const type = options.type.call(that,that);
                    options.type = type;
                }
                if (options.title && typeof options.title === 'function') {
                    const title = options.title.call(that,that);
                    options.title = title;
                }
                if (options.content && typeof options.content === 'function') {
                    const content = options.content.call(that,that);
                    options.content = content;
                }
                if (options.confirmType === 'delete') {
                    // @ts-ignore
                    OpenDeleteConfirm(options)
                }
                else if (options.confirmType === 'confirm') {
                    //@ts-ignore
                    OpenConfirm(options)
                }
                else if (options.confirmType === 'message') {
                    //@ts-ignore
                    OpenModal(options)
                }
            } catch (error) {
                options.logger && options.logger.call(this,{
                    that,
                })
            }
        }
        return descriptor;
    }
}