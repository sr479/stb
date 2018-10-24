import { enqueueSetState } from './set-state-queue'
import { PageEvent, PageType } from '../pageEvent';
import { HElement } from '../../basic/helement';
import { Json } from '../../basic/json';

/**
 * @description event 定义父组件尽可能不操作 event 对象
 */
export class Component<P={},S={}> {
    private isReactComponent: boolean;
    state: S;
    protected readonly props: P;
    protected readonly identCode;
    protected readonly tags: HElement;
    protected readonly index:number = 0;
    protected readonly event: PageEvent;
    protected readonly refs:HElement;

    constructor(props = <any>{}) {
        
        // 配置预定义对象
        const {identCode,event} = props;
        delete props.identCode;
        delete props.event;

        this.isReactComponent = true;

        this.state = <S>{};
        this.props = props;
        this.identCode = identCode;
        this.event = event;

        let hasSub = false, hasOff = false;

        // identCode event 检测
        if (undefined !== identCode && undefined !== event && event) {

            // 确保模块事件不会重复订阅
            if (this.event.hasSubscribe(this.identCode, PageType.Focus)) {
                // 更新订阅
                hasOff = true;
            }
            hasSub = true;

        }

        if (hasOff) {
            offAll(this.event, this.identCode);
        }
        if (hasSub) {
            event.on(identCode, PageType.Focus, (e: FocusEvent) => {
                this.componentFocusUpdate({ from: PageType.Focus });
            });
            event.on(identCode, PageType.Blur, (e: FocusEvent) => {
                this.componentFocusUpdate({ from: PageType.Blur });
            });
        }
    }

    setState(stateChange:S) {
        enqueueSetState(stateChange, this);
    }
    setFocus(index) {
        (<any>this).index = index;
        this.componentFocusUpdate({ from: PageType.Changed });
    }
    setIndex(index) {
        (<any>this).index = index;
    }
    componentWillUpdate() { };
    componentWillMount() { };
    componentDidUpdate(prevProps, prevState) { };
    componentDidMount() { };
    componentFocusUpdate(from) { };
    componentWillReceiveProps(){};
    
    render() { };
    subscribeToEvents() { };

    // 自定义事件
    onfocus(callback: (e: IFocus) => void) {
        this.event.on(this.identCode, PageType.Focus, callback);
    }
    onblur(callback: (e: IBlur) => void) {
        this.event.on(this.identCode, PageType.Blur, callback);
    }
    onkeydown(callback: (e: IKeydown) => void) {
        this.event.on(this.identCode, PageType.Keydown, (e: IKeydown) => {
            if(this.tags && this.tags.length){
                let ele = this.tags.eq(this.index);
                if (ele) {
                    let data = ele.attr('data-keydown');
    
                    if (data) {
                        e.data = Json.deSerializ(data);
                    }
                }
            }
            callback(e);
        });
    }
    target(identCode: string | number, data?: any) {
        this.event.target(identCode, data);
    }
    trigger(topic: string | number, data: any = null){
        this.event.trigger(this.identCode,topic,data);
    }
}
function offAll(event: PageEvent, identCode) {
    event.off(identCode, PageType.Focus);
    event.off(identCode, PageType.Blur);
    event.off(identCode, PageType.Keydown);
}