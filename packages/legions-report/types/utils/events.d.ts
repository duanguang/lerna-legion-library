export default Events;
declare class Events {
    handlers: {};
    on(event: any, handler: any): any;
    off(event: any): void;
    trigger(event: any, args: any): any;
}
