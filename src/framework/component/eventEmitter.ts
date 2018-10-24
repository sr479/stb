import { Dictionary } from "../conllection/dictionary";
import { Queue } from "../conllection/queue";
import { AppEvent } from "../basic/appEvent";

/**
 * @name 事件队列
 */
export class EventEmitter implements IEventEmitter {
    protected _metiator: IMediator;
    protected _dictionary: Dictionary<Queue>;

    constructor(metiator: IMediator) {
        this._metiator = metiator;
        this._dictionary = new Dictionary<Queue>();
    }

    public triggerEvent(event: IAppEvent) {

        let key: any = event.topic, queue: Queue = null, callQueue: Queue = new Queue();
        // 是否是否已订阅
        if (this._dictionary.has(key)) {
            // 取得队列
            queue = this._dictionary.get(key);
            // 触发所有事件
            let data = queue.items, length = data.length;
            
            let _this = this;
            for (let i = 0; i < length; i++) {
                data[i].data = event.data;

                let callback = function () {
                    _this._metiator.publish(data[i]);
                }
                callQueue.enqueue(callback);
            }
            // 执行队列
            let call = null;

            while (call = callQueue.dequeue()) {
                call();
            }
        }

    }

    public subscribeToEvents(event: IAppEvent) {
        let key: any = event.topic, topic = '', queue: Queue = null;

        // 事件已订阅
        if (this._dictionary.has(key)) {
            // 取得队列事件集合
            queue = this._dictionary.get(key);
        }
        // 事件未订阅
        else {
            // 创建队列事件集合
            queue = new Queue();

            this._dictionary.set(key, queue);
        }
        // 为该事件添加新的订阅并添加到队列集合
        topic = event.topic + "-" + queue.size();
        event.topic = topic;
        queue.enqueue(event);

        this._metiator.subscribe(event);
    }

    public unsubscribeToEvents(event: IAppEvent) {
        let key: any = event.topic, data = [], queue: Queue = null;
        // 该事件是否有订阅
        if (this._dictionary.has(key)) {
            // 取得事件队列集合
            queue = this._dictionary.get(key);

            // 注销队列中所有事件
            data = queue.items, length = data.length;
            for (var i = 0; i < length; i++) {
                this._metiator.unsubscribe(new AppEvent(data[i].topic, null, null));
            }
            // 删除该事件
            this._dictionary.remove(key)
        }
    }

    public hasSubscribe(event: IAppEvent): boolean {
        let key: any = event.topic;
        return this._dictionary.has(key);
    }
}