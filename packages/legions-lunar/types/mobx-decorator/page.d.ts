import React from 'react';
interface IPageContext {
    page: IPageContextState;
    emit?: () => void;
}
export interface IPageContextProps {
    page?: IPageContextState;
    emit: () => void;
}
interface IPageContextState {
    loading?: boolean;
    submitting?: boolean;
    progress?: boolean;
}
export interface IPageChildState {
    loading?: boolean;
    submitting?: boolean;
    progress?: boolean;
}
interface IPageContainerProps {
}
interface IPageContainerState extends IPageContextState {
}
export declare class PageContainer extends React.Component<IPageContainerProps, IPageContainerState> {
    static childContextTypes: React.ValidationMap<any>;
    constructor(props: any, context: any);
    getChildContext(): IPageContext;
    componentWillMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
interface IOptions<T, S> {
    /**
     * 监听store 数据，并根据数据变化处理副作用
     * 结合mobx使用
     *
     * @memberof IOptions
     */
    sideEffect?: (that: T, ...store: any[]) => void;
    /**
     * 映射props 数据到state
     *
     * @memberof IOptions
     */
    mapPropsToPageState?: (props: {}) => IPageChildState;
    store?: string | string[];
}
export declare function page<T = {}, S = []>(options?: IOptions<T, S>): (WrappedComponent: React.ComponentClass<{}>) => any;
/**
 *  当操作结果还未返回时，再次触发按钮将不执行函数体代码
 * 结合page修饰器进行
 *
 * @export
 * @param {*} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @returns
 */
export declare function noSubmitting(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
export {};
