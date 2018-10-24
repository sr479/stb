
/**
 * @name 中介器
 */
interface IMediator {
    /**
     * @desc 它用来触发事件。当发布一个事件时，所有订阅事件的地方都会收到通知。
     */
    publish(e: IAppEvent): void;
    /**
     * @desc 它用来订阅一个事件，换句话说，为一个事件设置事件处理。
     */
    subscribe(e: IAppEvent): void;
    /**
     * @desc 它用来取消订阅一个事件，换句话说，移除一个事件的处理函数。
     */
    unsubscribe(e: IAppEvent): void;
}
/**
 * @name 程序事件
 */
interface IAppEvent {
    topic: string | number;
    data: any;
    handler: (e: any, data: any) => void;
}
// 配置部分
interface IPlayerSetting {
    // 播放地址
    mediaUrl?: string;
    instanceId?: number;
    // 显示方式
    /**
     * full 全屏 ; size 指定大小 left top width height
     */
    displayMethod?: 'full' | 'size';
    displayArea?: {
        left?: number,
        top?: number,
        width?: number,
        height?: number
    },
    onStartPlay?: () => void,
    onStopPlay?: () => void,
    onChangeMeter?: (currentTime: number, totalTime: number) => void;
    //configPlayModel not default
}
interface IEventEmitter {
    triggerEvent(event: IAppEvent): void;
    subscribeToEvents(event: IAppEvent): void;
    unsubscribeToEvents(event: IAppEvent): void;
    hasSubscribe(event: IAppEvent): boolean;
}

// 播放器
interface IMuteVolume {
    currentVolume: number
}
interface IResumeVolume {
    currentVolume: number
}
interface IProgressChanging {
    currentTime: number;
    totalTime: number;
}
interface IProgressChanged {
    currentTime: number;
    totalTime: number;
}
interface IVolumeChanged {
    currentVolume: number;
}
interface IVolumeChanging {
    currentVolume: number;
}
interface IVolumeInit {
    currentVolume: number;
}
interface IReleased {
    success: boolean;
    code:number;
    instanceId:number;
}
interface ITotalProgressInit {
    currentTime: number;
    totalTime: number;
}
interface IStartPlaying {
    totalTime: number;
}
// 数据分页
interface IManagementDB<T> {
    getItem(pageIndex: number, callback?: (list: Array<T>) => void): void;
}
interface IHElement {
    readonly length: number;

    // (eleName: string): HElement;
    // (htmlElement: HTMLElement): HElement;
    // (htmlElements: HTMLElement[]): HElement;
    // (eleName: string | HTMLElement | HTMLElement[]): HElement;
    addClass(clasName: string): this;
    removeClass(): this;
    removeClass(clasName: string): this;
    removeClass(clasName?: string): this;
    html(): string;
    html(html: string): this;
    html(html?: string): this;
    text(): string;
    text(text: string): this;
    text(text?: string): this | string;
    style(propName: string): string;
    style(propName: string, value: string): this;
    style(propName: string, value?: string): this | string;
    removeStyle(): this;
    removeStyle(propertyName: string): this;
    removeStyle(propertyName?: string): this;
    attr(name: string): string;
    attr(name: string, value: string): this;
    attr(name: string, value?: string): this;
    removeAttr(name: string): this;
    show(): this;
    hide(): this;
    hidden(): this;
    visible(): this;
    hasClass(clasName: string): boolean;
    children(): IHElement;
    children(keyword: string): IHElement;
    eq(index: number): IHElement;
    get(index: number): HTMLElement;
    eqAll(): IHElement[];
    getAll(): HTMLElement[];
}
// 焦点对象事件回掉参数类型
interface ISite {
    common: ISite;
    guid: string;
    x: number;
    y: number;
    index: number;
    element: IHElement;
}
interface IChanged {
    /**
     * 模块唯一标识
     */
    identCode: number;
    /**
     * 事件执行状态
     */
    success: boolean;
    /**
     * 当前坐标对象
     */
    site: ISite;
    /**
     * 上一个坐标对象
     */
    previousSite: ISite;
    /**
     * 参数
     */
    data: any;
    /**
     * 键码
     */
    keyCode: number;
    /**
     * 事件触发是否来自系统(Focus 对象内部发出)
     */
    fromSystem: boolean;
}
// PageEvent 事件对象
interface IFocus {
    /**
     * 模块唯一标识
     */
    identCode: number;
    /**
     * 来源
     */
    source: number;
    /**
     * 参数
     */
    data: any;
    /**
     * 事件触发是否来自系统(Focus 对象内部发出)
     */
    fromSystem: boolean;
}
interface IBlur {
    /**
    * 模块唯一标识
    */
    identCode: number;
    /**
     * 来源
     */
    source: number;
    /**
     * 参数
     */
    data: any;
    /**
     * 事件触发是否来自系统(Focus 对象内部发出)
     */
    fromSystem: boolean;
}
interface IKeydown {
    /**
    * 模块唯一标识
    */
    identCode: number;
    /**
     * 来源
     */
    source: number;
    /**
     * 参数
     */
    data: any;
    /**
     * 键码
     */
    keyCode: number;
    /**
     * 事件触发是否来自系统(Focus 对象内部发出)
     */
    fromSystem: boolean;
}
interface IEnable {
    index: number;
    element: IHElement;
}
interface IDisable {
    index: number;
    element: IHElement;
}
interface IComponent {
    identCode: number;
    className?: string;
    leaveName?: string;
}


declare let Velocity: any;