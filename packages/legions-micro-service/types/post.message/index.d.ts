export declare const PostMessageUtils: {
    receiveMessage: (receive: any) => void;
    /**
     * 发送消息到子窗口
     *
     * @param {*} options
     * @memberof PostMessageUtils
     */
    sendMessageToChildrenWin(options: any): void;
    /**
     * 发送消息到父窗口
     *
     * @param {*} options
     * @memberof PostMessageUtils
     */
    sendMessageToParentWin(options: any): void;
};
