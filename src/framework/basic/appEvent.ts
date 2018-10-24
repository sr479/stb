/**
 * @name 程序事件
 */
class AppEvent implements IAppEvent {
    public guid: string;            // 标志
    public topic: string | number;           // 主题
    public data: any;               // 数据
    public handler: (e: object, data?: any) => void;    // 事件处理函数

    constructor(topic: string | number, data: any, handler: (e: any, data?: any) => void) {
        this.topic = topic;
        this.data = data;
        this.handler = handler;
    }
}
export { AppEvent }