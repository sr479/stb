import { Ajax } from "../framework/basic/ajax";
import { Dictionary } from "../framework/conllection/dictionary";
import { Json } from "../framework/basic/json";

/**
 * @name 数据逻辑
 */
export class RequestInfo {

    public readonly data: any;
    public readonly url: string;
    public header: any;
    public async: boolean;
    public readonly callback: (success: boolean, result: any) => void;

    constructor(url: string, data: any, callback: (response: ResponseInfo<any>) => void) {
        this.data = data;
        this.url = url;
        this.header = {};
        this.async = true;
        this.callback = function (status: boolean, res) {
            callback(new ResponseInfo(status, res));
        }
    }
}
// 响应类
export class ResponseInfo<T> {
    public readonly _success: boolean;
    public readonly _response: any;
    public success: boolean;
    public message: string;
    public status: number;
    public data: T;
    constructor(success: boolean, response: any) {
        this._success = success;
        this._response = response;
    }
}
/**
 * 逻辑类
 */
export class BaseLogic {
    constructor() {
    }
    protected requestGet(request: RequestInfo, cache: Dictionary) {
        // request.header['content-type'] = 'application/json';
        this.request(request, 'GET', true, cache);
    }
    protected requestPut(request: RequestInfo) {
        // request.header['content-type'] = 'application/x-www-form-urlencoded';
        this.request(request, 'PUT');
    }
    protected requestDelete(request: RequestInfo) {
        // request.header['content-type'] = 'application/x-www-form-urlencoded';
        this.request(request, 'DELETE');
    }
    protected requestPost(request: RequestInfo) {
        // request.header['content-type'] = 'application/x-www-form-urlencoded';
        this.request(request, 'POST');
    }
    protected requestNative(request: RequestInfo, jsonString: string) {
        setTimeout(() => {
            request.callback(true, JSON.parse(jsonString));
        }, 0);
    }
    protected syncGet(request: RequestInfo) {
        this.request(request, 'GET', false);
    }
    protected syncPost(request: RequestInfo) {
        this.request(request, 'POST', false);
    }
    private request(request: RequestInfo, method: string, async = true, cache?: Dictionary) {

        let isnet = true;

        // 处理缓存仅支持 GET
        if ('GET' == method) {
            let key = md5(`${request.url}${Json.serializ(request.data)}`);

            if (cache && cache.has(key)) {

                isnet = false;

                let result = cache.get(key);
                request.callback && request.callback(true, result);

            }
        }

        if (isnet) {
            new Ajax({
                url: request.url,
                async: async,
                method: method,
                data: request.data,
                success: function (result: any) {

                    // 处理缓存仅支持 GET
                    if ('GET' == method && cache) {
                        let key = md5(`${request.url}${Json.serializ(request.data)}`);

                        cache.set(key,result);
                    };

                    request.callback && request.callback(true, result);
                },
                failure: function (result: any) {
                    
                    // 处理缓存仅支持 GET
                    if ('GET' == method && cache) {
                        let key = md5(`${request.url}${Json.serializ(request.data)}`);

                        cache.set(key,result);
                    };

                    request.callback && request.callback(false, result);
                }
            });
        }
    }
}