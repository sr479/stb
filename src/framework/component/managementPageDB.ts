import { Dictionary } from "../conllection/dictionary";
import { DoublyLinkedList, DoublyLinkedNode } from "../conllection/doublyLinkedList";
import { FuncLock } from "../basic/funcLock";
import { PagingHelper } from "../basic/paging";

/**
 * @name 缓存分页
 */

interface IPramsOne {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
}
/**
 * 应用场景：带有下标的数据分页
 * 支持数据分页
 * 支持网络数据缓存
 * 高速读取缓存数据
 * 支持跃级缓存页面
 * 支持预缓存页数
 * 核心数据储存结构基于字典（Dictionary<Array<T>>）
 * 支持接口数据与 callbackSuccess 回掉数据一致
 * 兼容推荐接口数据与 callbackSuccess 回掉数据不一致 前提是对页面数据量完整性要求不高场景（默认兼容页面大小数量差的 100 % 以下（不包括100%），删除后的数据空缺会保存到预缓存页数的最后一页，高于 100%（包含）可能导致最后缓存页面为空）
 */
export class ManagementPageDB<T>{
    private PanelDictionary: Dictionary<Array<T>>;      // 页面集合
    private RequestPageCount: number;                   // 每次请求页数
    private NativeDataSize: number;                     // 已缓存数据条数
    public OnBeforeSendRequest: (params: IPramsOne, callbackSuccess: (data: Array<T>) => void) => void;
    private PageSize: number;

    constructor(pageSize?: number) {
        this.PageSize = pageSize;
        this.RequestPageCount = 3;     //默认请求 3 页
        this.NativeDataSize = 0;
        this.PanelDictionary = new Dictionary<Array<T>>();
    }
    // 根据页数
    public getItem(pageIndex: number, callback?: (list: Array<T>) => void): Promise<Array<T>> {
        return new Promise((resolve, reject) => {

            let dt: Array<any> = [];

            let pageList = this.PanelDictionary.get(`${pageIndex}`) || [];

            if (pageList.length) {
                // console.log('从缓存获取');
                dt = pageList;

                callback && callback(dt);

                resolve(<any>dt);
            } else {
                // console.log('从数据库获取');
                let pageSize = this.PageSize * this.RequestPageCount;
                let nPageIndex = Math.ceil(pageIndex / this.RequestPageCount);

                this.OnBeforeSendRequest({ pageIndex: nPageIndex, pageSize: pageSize, pageCount: this.RequestPageCount }, (paddingList) => {
                    //追加当前缓存
                    if (paddingList.length >= 1) {

                        let addIndex = (nPageIndex - 1) * (this.RequestPageCount) + 1;

                        if (this.RequestPageCount === 1) {
                            //添加一页数据
                            this.addItem(addIndex, paddingList);

                        } else if (this.RequestPageCount > 1 || this.RequestPageCount === 0) {
                            //添加多页数据
                            let nowDt = [];
                            let nowIndex = addIndex;//页数下标标记开始为当前请求下标
                            for (let i = 0; i < paddingList.length; i++) {

                                let item = paddingList[i];

                                nowDt.push(item);

                                //一页数据已满，或者已便利完所有数据
                                if (nowDt.length >= this.PageSize || i + 1 === paddingList.length) {

                                    this.addItem(nowIndex, nowDt);
                                    //清空当前页，继续填充下一页
                                    nowDt = [];
                                    ++nowIndex;

                                    //已便利完所有数据
                                    if (i + 1 === paddingList.length) {
                                        break;
                                    }
                                }
                            }
                        } else {
                            console.log('RequestPageLength Error Value:' + this.RequestPageCount);
                        }
                    }
                    // 再次取
                    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
                    let pgBoxs = this.PanelDictionary.get(`${pageIndex}`) || [];

                    if (pgBoxs && pgBoxs.length >= 1) {

                        //从缓存获取
                        dt = pgBoxs;

                        // console.log('缓存');
                        //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                    }
                    //根据页数获取
                    callback && callback(dt);

                    resolve(<any>dt);
                });
            }
        });
    }
    public addItem(pageIndex: number | string, value: Array<T>) {
        if (!this.PanelDictionary.has(String(pageIndex))) {
            this.PanelDictionary.set(String(pageIndex), value);
            this.NativeDataSize += value.length; // 累加已缓存数据量
        }
    }
    /**
     * 假如 pageSize为 10 count 2 那么每次网络请求数据长度为20，但DB对象返回前十条，并本地缓存二十条。默认请求全部数据
     * @param count 每次网络请求缓存页面总数
     */
    public setRequestPageCount(count: number) {
        this.RequestPageCount = count;
    }
    /**
     * 缓存数目
     */
    public cacheCount(): number {
        return this.NativeDataSize;
    }
    /**
     * 清空缓存
     */
    public clearCache() {
        this.PanelDictionary.clear();
        this.NativeDataSize = 0;
    }
}
interface IPramsFlow<T> {
    fetch: 'after' | 'before' | 'first';
    pageSize: number;
    marginList: T[];
}
/**
 * 应用场景：没有下标和页面大小的数据流，手机端的前后刷新等
 * 支持数据分页（不支持页标记录）
 * 支持网络数据缓存
 * 高速读取缓存数据
 * 不支持跃级缓存页面（支持兄弟关系访问）
 * 不支持预缓存页数（每次请求一页）
 * 核心数据储存结构基于双向链表（DoublyLinkedList）
 * 兼容推荐接口数据与 callbackSuccess 回掉数据不一致
 */
export class ManagementBothwayDB<T>{
    private doublyLinked = new DoublyLinkedList<Array<T>>();          // 页面集合
    private node: DoublyLinkedNode<Array<T>>;
    private NativeDataSize = 0;                     // 已缓存数据条数
    public OnBeforeSendRequest: (params: IPramsFlow<T>, callbackSuccess: (list: T[]) => void) => void;
    private PageSize: number;
    // 请求队列
    private func: FuncLock;

    constructor(pageSize?: number) {
        this.PageSize = pageSize;
        this.func = new FuncLock();
    }
    // 当前流的前后刷新数据
    /**
     * TOTD
     * 扩展该参数 传入 Node 节点自动获取数据 可获取节点前面的和后面的，有本地就获取本地，没有本地就获取网络
     * @param fetch 
     * @param callback 
     */
    private getItem(fetch: 'after' | 'before', callback?: (list: T[]) => void) {
        this.func.enable(() => {
            let marginList: T[] = [], way: any = 'first';

            if (!this.doublyLinked.isEmpty()) {
                way = fetch;
                if ('after' === fetch)
                    marginList = this.doublyLinked.getTail() ? this.doublyLinked.getTail().element : [];
                if (!marginList.length)
                    marginList = this.doublyLinked.getHead() ? this.doublyLinked.getHead().element : [];
            }

            this.OnBeforeSendRequest({ fetch: way, pageSize: this.PageSize, marginList: marginList }, (list: Array<T>) => {
                //追加当前缓存
                if (list.length) {
                    let node: DoublyLinkedNode<T> = null;
                    // 缓存
                    if (this.doublyLinked.isEmpty() || fetch === 'after') {
                        // 首次加载
                        this.doublyLinked.append(list);
                    }
                    else if (fetch === 'before') {
                        this.doublyLinked.insert(0, list);
                    }
                    this.NativeDataSize += list.length;
                    // 再次取缓存
                    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
                    this.func.clear();
                    callback && callback(list);
                } else {
                    // 没有值
                    this.func.clear();
                    callback && callback([]);
                }
            });
        })
    }
    /**
     * 缓存数目
     */
    public cacheCount(): number {
        return this.NativeDataSize;
    }
    public getHead(): DoublyLinkedNode<T[]> {
        return this.doublyLinked.getHead();
    }
    public getTial(): DoublyLinkedNode<T[]> {
        return this.doublyLinked.getTail();
    }
    public getCurrentNode(): DoublyLinkedNode<T[]> {
        return this.node;
    }
    public setCurrentNode(node: DoublyLinkedNode<T[]>): void {
        this.node = node;
    }
    public isEmpty(): boolean {
        return this.doublyLinked.isEmpty();
    }
    toNextPage(callback: (nextList: T[]) => void) {
        // 未设置当前node 代表首次加载
        // 当前 current 没有值 返回空数组
        // 下一个节点为空
        // 下一个节点有值
        // 为空就请求网络
        if (!this.node && this.getHead()) {
            // 缓存后首次加载
            this.node = this.getHead();
            callback(this.node.element || []);
        } else {
            let list = [];
            if (this.node) {
                // 从某个节点之后开始加载
                if (this.node.next) {
                    list = this.node.next.element || [];
                } else {
                    list = [];
                }
            } else {
                list = [];
            }
            if (!list.length) {
                // 未缓存首次网络数据加载
                this.getItem('after', (data) => {
                    this.node = this.doublyLinked.getTail();
                    callback(data);
                })
            } else {
                callback(list);
            }
        }
    }
    toPreviousPage(callback: (nextList: T[]) => void) {
        // 未设置当前node 代表首次加载
        // 当前 current 没有值 返回空数组
        // 下一个节点为空
        // 下一个节点有值
        // 为空就请求网络
        if (!this.node && this.getHead()) {
            // 缓存后首次加载
            this.node = this.getHead();
            callback(this.node.element || []);
        } else {
            let list = [];
            if (this.node) {
                // 从某个节点之前开始加载
                if (this.node.prev) {
                    list = this.node.prev.element || [];
                } else {
                    list = [];
                }
            } else {
                list = [];
            }
            if (!list.length) {
                // 未缓存首次网络数据加载
                this.getItem('before', (data) => {
                    this.node = this.doublyLinked.getHead();
                    callback(data);
                })
            } else {
                callback(list);
            }
        }
    }
}

/**
 * 数据管理分页
 * 支持本地数据分页
 * 支持数据开始下标与结束下标记录
 * 一次性缓存所有数据
 */
export class ManagementPageDBToNative<T>{
    private PanelDictionary: Dictionary<Array<T>>;      // 页面集合
    private NativeDataSize: number;                     // 已缓存数据条数

    private PageSize: number;
    // 请求队列
    private func: FuncLock;

    constructor(pageSize?: number) {
        this.PageSize = pageSize;
        this.NativeDataSize = 0;
        this.PanelDictionary = new Dictionary<Array<T>>();
        this.func = new FuncLock();
    }
    public initData(list: T[]) {
        //追加当前缓存
        if (list.length >= 1) {
            let pageIndex = 1;

            //添加多页数据
            let nowDt = [];
            let nowIndex = pageIndex;//页数下标标记开始为当前请求下标
            for (let i = 0; i < list.length; i++) {

                let item = list[i];

                nowDt.push(item);

                //一页数据已满，或者已便利完所有数据
                if (nowDt.length >= this.PageSize || i + 1 === list.length) {
                    this.setItem(nowIndex, nowDt);
                    //清空当前页，继续填充下一页
                    nowDt = [];
                    ++nowIndex;

                    //已便利完所有数据
                    if (i + 1 === list.length) {
                        break;
                    }
                }
            }
        }
    }
    // 根据页数
    public getItem(pageIndex: number, callback?: (list: Array<T>) => void): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            this.func.enable(() => {
                let dt: Array<any> = [];

                let pageList = this.PanelDictionary.get(`${pageIndex}`) || [];

                if (pageList.length) {
                    // console.log('从缓存获取');
                    dt = pageList;
                    //根据页数获取
                    this.func.clear();
                    callback && callback(dt);

                    resolve(dt);
                }
            })
        });

    }
    public setItem(pageIndex: number | string, value: Array<T>) {
        if (!this.PanelDictionary.has(String(pageIndex))) {
            this.PanelDictionary.set(String(pageIndex), value);
            this.NativeDataSize += value.length; // 累加已缓存数据量
        }
    }
    /**
     * 缓存数目
     */
    public cacheCount(): number {
        return this.NativeDataSize;
    }
    /**
     * 清空缓存
     */
    public clearCache() {
        this.PanelDictionary.clear();
        this.NativeDataSize = 0;
    }
}

/**
 * 未测试
 * 编辑作者：张诗涛
 * 创建时间：2018年5月31日 17点09分
 * 功能分类：数据分页|数据缓存|动态页数
 */
export class ManagementDynamicDB<T>{
    private dataList: Array<T> = [];        // 页面集合
    private requestPageCount: number = 3;   // 每次请求页数
    requestMethod: (params: { pageIndex: number; pageSize: number; }) => Promise<Array<T>>;
    private pageSize: number;
    private complete = false;

    constructor(pageSize: number) {
        this.pageSize = pageSize;
    }
    public getPage(pageIndex: number, pageSize: number = this.pageSize): Promise<Array<T>> {

        console.log(pageIndex, pageSize)

        return new Promise((resolve, reject) => {

            let list = this.dataList;

            let scope = PagingHelper.getScope({ pageIndex: pageIndex, pageSize: pageSize });

            if (this.complete || (list.length && (scope.startAt + scope.maxItems) <= list.length)) {

                console.log('从缓存获取');

                let reLis: Array<T> = [], starAt = scope.startAt - 1;

                reLis = this.getCacheRange(starAt, scope.maxItems);

                resolve(reLis);
            } else {
                console.log('从数据库获取');

                pageSize = this.pageSize * this.requestPageCount;

                this.requestMethod({ pageIndex: pageIndex, pageSize: pageSize }).then((list) => {
                    let reLis: Array<T> = [], starAt = scope.startAt - 1, star = starAt;

                    if (list.length) {
                        let len = list.length;

                        for (let i = 0; i < pageSize; i++) {

                            if (list[i]) {
                                this.dataList[star] = list[i];
                            } else {
                                this.complete = true;
                                console.log("缓存完毕")
                                break;
                            }

                            star++;
                        }
                        reLis = this.getCacheRange(starAt, scope.maxItems);
                    }
                    resolve(reLis);
                });
            }
        });
    }
    public getRange(startAt: number, maxItems: number = this.pageSize): Promise<Array<T>> {
        return new Promise((resolve, reject) => {
            let difference = (startAt + maxItems) - this.dataList.length;

            if (0 < difference && !this.complete) {

                // network
                let stopPageIndex = Math.ceil(this.dataList.length / this.pageSize) || 1;

                this.getPage(stopPageIndex).then((list) => {

                    let reLis = this.getCacheRange(startAt, maxItems);

                    resolve(reLis);
                });

            } else {
                let reLis = this.getCacheRange(startAt, maxItems);
                resolve(reLis);
            }
        });
    }
    public getPageStartAt(startAt: number, pageIndex: number, pageSize: number = this.pageSize): Promise<Array<T>> {
        startAt = startAt * pageIndex;
        let maxItems = pageSize;

        return new Promise((resolve) => {
            this.getRange(startAt, maxItems).then((list) => {
                if (list.length > pageSize) {
                    list.length = pageSize;
                }
                resolve(list);
            })
        });
    }
    private getCacheRange(starAt: number, maxItems: number): Array<T> {
        starAt = starAt--;
        let reLis: Array<T> = [], list = this.dataList, len = maxItems;

        for (let i = 0; i < len; i++) {
            if (list.length > starAt) {
                reLis.push(list[starAt]);
            } else {
                break;
            }
            starAt++;
        }

        return reLis;
    }
    public setRequestPageCount(count: number) {
        this.requestPageCount = count;
    }
    public cacheCount(): number {
        return this.dataList.length;
    }
    public clearCache() {
        this.dataList.length = 0;
    }
}