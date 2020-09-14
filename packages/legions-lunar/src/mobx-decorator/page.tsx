import React from 'react'
/* import { observer } from 'legions/store-react'
import { autorun, observable, runInAction } from 'mobx'; */
import { shortHash } from '../object-hash';
//@ts-ignore
import { warningOnce } from '../warning';
//@ts-ignore
import { schedule } from '../schedule';
import { ISchedule } from '../../types/api/schedule';
//@ts-ignore
import * as PropTypes from 'prop-types';
interface IPageContext {
    page: IPageContextState
    emit?: () => void
}
export interface IPageContextProps {
    page?: IPageContextState
    emit: () => void
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

let mountedContainerInstance = null;
const mountedWrapperInstances = [];
class PageWrapper<P = {}> {
    instance: P | React.ReactElement<any>;
    mapPropsToPageState: (props) => IPageChildState;
    uuid: string;
    constructor(instance: P,mapPropsToPageState: (props) => IPageChildState,uuid: string) {
        this.instance = instance;
        this.mapPropsToPageState = mapPropsToPageState;
        this.uuid = uuid;
    }
}
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
function emitChange(uuid?: string) {
    let newState: IPageContextState = { loading: false,submitting: false,progress: false };
    mountedWrapperInstances.forEach((wrapper: PageWrapper) => {

        if (wrapper.uuid === uuid) {
            // @ts-ignore
            let temp = wrapper.mapPropsToPageState(wrapper.instance.props)
            newState.loading = newState.loading || temp.loading;
            newState.submitting = newState.submitting || temp.submitting;
            newState.progress = newState.progress || temp.progress;
            /* let state = mountedContainerInstance.state; */
            // @ts-ignore
            let state = wrapper.instance.state;
            for (let key in newState) {
                if (newState[key] !== state[key]) {
                    /* mountedContainerInstance.setState(newState); */
                    // @ts-ignore
                    wrapper.instance.setState(newState);
                    break;
                }
            }
        }
    })

}
export class PageContainer extends React.Component<IPageContainerProps,IPageContainerState>{
    static childContextTypes: React.ValidationMap<any> = {
        page: PropTypes.any,
        emit: PropTypes.func
    }
    constructor(props,context) {
        super(props,context)
        this.state = {
            loading: false,
            submitting: false,
            progress: false
        }
    }
    getChildContext(): IPageContext {
        return {
            page: {
                loading: this.state.loading,
                submitting: this.state.submitting,
                progress: this.state.progress
            },
            emit: emitChange
        }
    }
    componentWillMount() {
        if (mountedContainerInstance) {
            throw new Error("page container must single.");
        }
        //@ts-ignore
        mountedContainerInstance = this;
    }
    componentWillUnmount() {
        mountedContainerInstance = null;
    }
    render() {
        return <div>{this.props.children}</div>
    }
}
interface IOptions<T,S> {

    /**
     * 监听store 数据，并根据数据变化处理副作用 
     * 结合mobx使用
     *
     * @memberof IOptions
     */
    sideEffect?: (that: T,...store: any[]) => void;

    /**
     * 映射props 数据到state
     *
     * @memberof IOptions
     */
    mapPropsToPageState?: (props: {}) => IPageChildState;

    store?: string | string[];
}

export function page<T = {},S = []>(options?: IOptions<T,S>): (WrappedComponent: React.ComponentClass<{}>) => any {
    return (WrappedComponent: React.ComponentClass<{}>) => {
        /* @observer */
        class page extends React.Component<{},{}>{
            static displayName = 'page(' + getDisplayName(WrappedComponent) + ')'
            static contextTypes = { page: PropTypes.any,emit: PropTypes.func }
            timeId = new Date().getTime()
            uid = `page${shortHash(this.timeId)}`
            //@ts-ignore
            subscription: ISchedule = null;
            //@ts-ignore
            subscriptionWatch: ISchedule = null;
            //@ts-ignore
            ref: T = null
            constructor() {
                super();
                this.state = {
                    loading: false,
                    submitting: false,
                    progress: false
                }
            }
            componentWillMount() {
                if (this.context.page && options && options.mapPropsToPageState) {
                    //@ts-ignore
                    mountedWrapperInstances.push(new PageWrapper<page>(this,options.mapPropsToPageState,this.uid));
                    /* emitChange(); */
                    this.subscription = schedule([this.dispatch.bind(this)]);

                }
            }
            componentDidMount() {
                if (options && options.sideEffect) {
                    this.subscriptionWatch = schedule([this.watch.bind(this),this.props]);
                }
            }
            dispatch = () => {
                if (this.context.page && options && options.mapPropsToPageState) {
                    emitChange(this.uid);
                }
            }
            watch = (props) => {
                let store = []
                if (options) {
                    if (options.store && typeof options.store === 'string') {
                        store = []
                        warningOnce(props[options.store],'page(' + getDisplayName(WrappedComponent) + ')' + '你需要监听的数据store在props对象上不存在');
                        //@ts-ignore
                        store.push(props[options.store])
                    }
                    else if (options.store && Array.isArray(options.store)) {
                        store = []
                        options.store.map((item) => {
                            warningOnce(props[item],'page(' + getDisplayName(WrappedComponent) + ')' + '你需要监听的数据store在props对象上不存在');
                            //@ts-ignore
                            store.push(props[item])
                        })
                    }
                    else {
                        store = []
                        warningOnce(props['store'],'page(' + getDisplayName(WrappedComponent) + ')' + '你需要监听的数据store在props对象上不存在');
                        //@ts-ignore
                        store.push(props['store'])
                    }
                }
                (options && options.sideEffect) && options.sideEffect(this.ref,...store)
            }
            componentWillReact() {
            }
            componentWillUnmount() {
                if (this.context.page && options && options.mapPropsToPageState) {
                    //@ts-ignore
                    var index = mountedWrapperInstances.findIndex((item) => item.instance == this);
                    mountedWrapperInstances.splice(index,1);
                    emitChange(this.uid);
                }
                if (this.subscription) {
                    this.subscription.unsubscribe()
                    //@ts-ignore
                    this.subscription = null;
                }
                if (this.subscriptionWatch) {
                    this.subscriptionWatch.unsubscribe();
                    //@ts-ignore
                    this.subscriptionWatch = null;
                }
            }
            render() {
                const props = {
                    ...this.props,
                    /* page: this.context.page, */
                    page: this.state,
                    /* emit: this.context.emit */
                }
                /* return React.createElement(component, props); */
                // @ts-ignore
                return <WrappedComponent {...props} ref={ref => this.ref = ref}></WrappedComponent>;
                /* return <WrappedComponent {...props} ref={ref=>runInAction(()=>this.ref=ref) }></WrappedComponent>; */
            }
        }
        return page
    }
}

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
export function noSubmitting(target: any,propertyKey: string,descriptor: PropertyDescriptor) {
    const oldValue = descriptor.value;
    descriptor.value = function () {
        //@ts-ignore
        if (this.props.page && this.props.page.submitting) {
            return;
        }
        oldValue.apply(this,arguments);
    };
    return descriptor;
}