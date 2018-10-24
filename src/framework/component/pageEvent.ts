import { Mediator } from "../basic/mediator";
import { SetTimeout } from "../basic/setTimeout";
import { EventEmitter } from "./eventEmitter";
import { AppEvent } from "../basic/appEvent";

/**
 * @name 页面事件驱动
 */
var PageType = {
    /**
     * 模块获取焦点
     */
    Focus: 'focus',
    /**
     * 模块失去焦点
     */
    Blur: 'blur',
    /**
     * 用户点击触发
     */
    Keydown: 'keydown',
    /**
     * 基于PageEvent 相关异常信息
     */
    Error: 'PageEventType.Error',
    Blank: "blank",
    Previous: "previous",
    Changed: "changed"
}

class PageEvent {
    private readonly _eventEmitter: IEventEmitter;
    private readonly events: Array<{ target?: Document | Window, topic: string | number, data: any, handler: Array<string | number>; }>;
    private targetName: string | number = null;
    private previousName: string | number = null;
    private disableTops: number[] = [];
    private lockTops: number[] = [];
    private lockKeycodes: any = {};

    constructor(targetName: string | number, events: Array<{ target?: Document | Window, topic: string | number, data: any, handler: Array<string | number>; }>, otherDebug: boolean = false, emitterDebug: boolean = false, ) {
        this.events = events;
        let mediator = new Mediator(emitterDebug);
        this._eventEmitter = new EventEmitter(mediator);
        // 订阅异常事件
        if (otherDebug) {
            this.subscribeEvent();
        }
        this.initialize(events);
        // 解释器初始化后触发
        new SetTimeout().enable(() => {
            if (null === this.targetName) {
                if (null !== targetName)
                    this.target(targetName);
                else
                    this.trigger("*", PageType.Error, "当前 PageEvent 未设置默认焦点模块");
            }
        });
    }
    private initialize(events: Array<{ target?: Document | Window, topic: string | number, data: any, handler: Array<string | number>; }>) {
        for (var i = 0; i < events.length; i++) {
            let ele: any = events[i];
            ele.target = ele.target || document;    // 默认目标文档

            ele.target[`on${ele.topic}`] = (event: any) => {
                let e = event || window.event;

                // 订阅所有 处理
                for (let j = 0; j < ele.handler.length; j++) {
                    let targetName = ele.handler[j];

                    // 焦点事件
                    if (this.targetName == targetName) {

                        const res: IKeydown = {
                            identCode: parseInt(targetName),
                            source: <number>this.previousName,
                            data: undefined,
                            keyCode: e.keyCode,
                            fromSystem: true
                        }

                        let trigger = false;
                        if (!this.hasDisable(targetName)) {
                            if (!this.hasLock(targetName)) {
                                trigger = true;
                            } else {
                                // 锁定的键码
                                if (!this.hasLockKeycode(targetName, e.keyCode)) {
                                    trigger = true;
                                }
                            }
                        }
                        if (trigger) {
                            // 发布当前触发事件简码事件
                            // 取消 2018年08月01日13:00:00
                            // if (res && res.keyCode) {
                            //     this.trigger(targetName, res.keyCode, res);
                            // }
                            // topic 为 number 类型默认当中 keyCode 处理
                            this.trigger(targetName, ele.topic, res);
                            // 所有模块的事件
                            // this.trigger("*", ele.topic, params);
                        }
                        break;
                    }
                }
            }
        }
    }
    trigger(identCode: string | number, topic: string | number, data: any = null) {
        this._eventEmitter.triggerEvent(new AppEvent(`${identCode}-${topic}`, data, null));
    }
    on(identCodes: string | number, topic: string | number, callback: any): void;
    on(identCodes: string[] | number[], topic: string | number, callback: any): void;
    on(identCode: any, topic: string | number, callback: any): void {
        // 单条数据
        if (typeof identCode !== "object") {
            this._eventEmitter.subscribeToEvents(new AppEvent(`${identCode}-${topic}`, null, callback));
        }
        // 多条数据
        else {
            let data = identCode, len = data.length, i = 0, item: string;
            for (; i < len; i++) {
                item = `${data[i]}`;
                this.on(item, topic, callback);
            }
        }
    }
    off(identCodes: string | number, topic: string | number): void;
    off(identCodes: string[] | number[], topic: string | number): void;
    off(identCode: any, topic: string | number): void {
        // 单条数据
        if (typeof identCode !== "object") {
            this._eventEmitter.unsubscribeToEvents(new AppEvent(`${identCode}-${topic}`, null, null));
        }
        // 多条数据
        else {
            let data = identCode, len = data.length, i = 0, item: string;
            for (; i < len; i++) {
                item = `${data[i]}`;
                this.off(item, topic);
            }
        }
    }
    hasSubscribe(identCode: string | number, topic: string | number): boolean {
        return this._eventEmitter.hasSubscribe(new AppEvent(`${identCode}-${topic}`, null, null));
    }
    target(identCode: string | number, data?: any) {
        // 是否有模块订阅该事件（通常为 Focus 也可以是其他自定义组件）
        if (false && !this.hasSubscribe(identCode, PageType.Focus)) {
            this.trigger("*", PageType.Error, "当前 PageEvent 的 target 执行焦点移交时模块：" + identCode + " 未订阅Focus相关事件当前操作无效");
        } else {
            // 加入有效模块列表，否则不予执行
            // events 目前仅处理第一组数据的 keydown 事件。
            let handlers = this.events[0].handler;
            if (typeof handlers[<number>identCode] == 'number') {

                // 如果被标记为禁用则不处理
                if (!this.hasDisable(Math.round(<number>identCode))) {
                    let pre = this.targetName;
                    // 失去焦点
                    if (this.targetName !== null) {

                        const res: IBlur = {
                            identCode: <number>identCode,
                            source: <number>pre,
                            data: data,
                            fromSystem: true
                        }

                        this.trigger(pre, PageType.Blur, res);
                    }

                    // 获取焦点
                    const res: IFocus = {
                        identCode: <number>identCode,
                        source: <number>pre,
                        data: data,
                        fromSystem: true
                    }
                    if (null !== pre) {
                        this.previousName = pre;
                    }

                    this.targetName = identCode;
                    this.trigger(identCode, PageType.Focus, res);
                }

            } else {
                this.trigger("*", PageType.Error, "当前 PageEvent 的 target 执行焦点移交时模块：" + identCode + " 未加入 PageEvent 的 handler 列表当前操作无效");
            }
        }
    }
    getTargetIdentCode() {
        return this.targetName;
    }
    getPreviousIdentCode() {
        return this.previousName;
    }
    private subscribeEvent() {
        // 程序异常调试参考信息
        this.on("*", PageType.Error, (msg: any) => {
            console.log(msg);
        });
    }
    enableTopic(identCode: number) {
        let list = this.disableTops, length = list.length;
        for (let i = 0; i < length; i++) {
            const ele = list[i];
            if (identCode == ele) {
                delete list[i];
                this.trigger("*", PageType.Error, "PageEvent 已将 " + identCode + " 模块启用")
                break;
            }
        }
    }
    disableTopic(identCode: number) {
        let list = this.disableTops, length = list.length, isAdd = true;
        for (let i = 0; i < length; i++) {
            const ele = list[i];
            if (identCode == ele) {
                isAdd = false;
                break;
            }
        }
        if (isAdd) {
            list.push(identCode);
        }
    }
    hasDisable(identCode: number): boolean {
        let list = this.disableTops, length = list.length, isDisable = false;
        for (let i = 0; i < length; i++) {
            const ele = list[i];
            if (identCode == ele) {
                isDisable = true;
                break;
            }
        }
        return isDisable;
    }
    lockTopic(identCode: number, keyCodes?: number[]) {
        let list = this.lockTops, length = list.length, isAdd = false;
        for (let i = 0; i < length; i++) {
            const ele = list[i];
            if (identCode == ele) {
                isAdd = true;
                break;
            }
        }
        if (!isAdd) {
            list.push(identCode);
            this.trigger("*", PageType.Error, "PageEvent 已将 " + identCode + " 模块锁定")
        }
        // 锁定 keyCode
        if (keyCodes && keyCodes.length) {
            keyCodes.forEach((v, i) => {
                this.lockKeycode(identCode, v);
            });
        }
    }
    unlockTopic(identCode: number, keyCodes?: number[]) {
        let isRemove = false;
        // 解锁 keyCode
        if (undefined != keyCodes) {
            if (keyCodes && keyCodes.length) {
                keyCodes.forEach((v, i) => {
                    this.unlockKeycode(identCode, v);
                });
                let arr: Array<number> = this.lockKeycodes[identCode], j = 0;
                for (let i = 0; i < arr.length; i++) {
                    const ele = arr[i];
                    if (ele) {
                        j++;
                        break;
                    }
                }
                if (!j) {
                    isRemove = true;
                }
            }
        } else {
            // 删除所有
            this.unlockKeycode(identCode);
            isRemove = true;
        }
        // 所有键码都被删除则删除焦点锁定
        if (isRemove) {
            let list = this.lockTops, length = list.length;
            for (let i = 0; i < length; i++) {
                const ele = list[i];
                if (identCode == ele) {
                    delete list[i];
                    this.trigger("*", PageType.Error, "PageEvent 已将 " + identCode + " 模块解锁")
                    break;
                }
            }
        }
    }
    hasLock(identCode: number) {
        let list = this.lockTops, length = list.length, isLock = false;
        for (let i = 0; i < length; i++) {
            const ele = list[i];
            if (identCode == ele) {
                isLock = true;
                break;
            }
        }
        return isLock;
    }
    private lockKeycode(identCode: number, keyCode: number) {
        let keycodes: number[] = <any>this.lockKeycodes[identCode];
        if (keycodes && keycodes.length) {
            let isAdd = true;
            for (let i = 0; i < keycodes.length; i++) {
                const ele = keycodes[i];
                if (keyCode == ele) {
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                keycodes.push(keyCode);
                this.trigger("*", PageType.Error, "PageEvent 已将 keyCode:" + keyCode + " 禁用");
            }
        } else {
            this.lockKeycodes[identCode] = [keyCode];
            this.trigger("*", PageType.Error, "PageEvent 已将 keyCode:" + keyCode + " 禁用");
        }
    }
    private unlockKeycode(identCode: number, keyCode?: number) {
        if (undefined != keyCode) {
            let keycodes: number[] = <any>this.lockKeycodes[identCode];
            if (keycodes && keycodes.length) {
                for (let i = 0; i < keycodes.length; i++) {
                    const ele = keycodes[i];
                    if (keyCode == ele) {
                        delete keycodes[i];
                        this.trigger("*", PageType.Error, "PageEvent 已将 keyCode:" + keyCode + " 启用");
                        break;
                    }
                }
            }
        } else {
            // 删除所有相关 keyCode 集合
            this.lockKeycodes[identCode] = [];
            this.trigger("*", PageType.Error, "PageEvent 已将 identCode:" + identCode + " 解锁");
        }
    }
    /**
     * 该 identCode 对应 锁定码列表如果为空则返回 true
     * 该 identCode 对应 解锁码列表至少有一个元素且存在 keyCode 则返回 true
     * @param identCode 
     * @param keyCode 
     */
    private hasLockKeycode(identCode: number, keyCode: number) {
        let keycodes: number[] = <any>this.lockKeycodes[identCode], isLock = false;
        if (keycodes && keycodes.length) {
            for (let i = 0; i < keycodes.length; i++) {
                const ele = keycodes[i];
                if (keyCode == ele) {
                    isLock = true;
                    break;
                }
            }
        } else {
            isLock = true;
        }
        return isLock;
    }
}
export { PageEvent, PageType }