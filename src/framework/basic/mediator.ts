/**
 * @name 调度器
 */
class Mediator implements IMediator {
    private _$: any;
    private _isDebug:boolean;

    constructor(isDebug: boolean = false) {
        this._$ = new $();
        this._isDebug = isDebug;
    }

    public publish(e: IAppEvent): void {
        if (this._isDebug === true) {
            console.log(new Date().getTime(),
                "PUBLISH", e.topic, e.data);
        }
        this._$.trigger(e.topic, e.data);
    }
    public subscribe(e: IAppEvent): void {
        if (this._isDebug === true) {
            console.log(new Date().getTime(),
                "SUBSCRIBE", e.topic, e.data);
        }
        this._$.on(e.topic, e.handler);
    }
    public unsubscribe(e: IAppEvent) {
        if (this._isDebug === true) {
            console.log(new Date().getTime(),
                "UNSUBSCRIBE", e.topic, e.data);
        }
        this._$.off(e.topic);
    }
}

//-------------------------------------- 事件处理器 -----------------------------
class $ {
    private topic: string;           // 主题
    private data: any;               // 数据
    private handler: (e: object, data?: any) => void;    // 事件处理函数

    private record: any = {};             // 记录

    constructor() {
    }
    public on(topic: string, handler: (e: object, data?: any) => void) {
        this.record[topic] = handler;
    }
    public off(topic: string) {
        delete this.record[topic];
    }
    public trigger(topic: string, data: any) {
        let method = this.record[topic] || null;
        return method ? method(data) : null;
    }
}
export { Mediator }