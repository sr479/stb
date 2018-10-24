export class ParseUrl {
    private readonly search: string;
    constructor(search: string) {
        this.search = search;
    }
    getParam() {
        return this.decodeURL();
    }
    getDecodeURI() {
        return this.decodeURL(decodeURI);
    }
    getDecodeURIComponent() {
        return this.decodeURL(decodeURIComponent);
    }
    private decodeURL(decode?: any) {
        let search = this.search;

        if (!decode) {
            decode = function (str: string) {
                return str;
            }
        }

        //返回当前 URL 的查询部分（问号 ? 之后的部分）。
        let urlParameters = location.search;
        if (search) urlParameters = search;
        //声明并初始化接收请求参数的对象
        var requestParameters: any = {};
        //如果该求青中有请求的参数，则获取请求的参数，否则打印提示此请求没有请求的参数
        let idx = urlParameters.indexOf('?');
        if (idx != -1) {
            //获取请求参数的字符串
            var parameters = urlParameters.substr((idx + 1));
            //将请求的参数以&分割中字符串数组
            let parameterArray = parameters.split('&');
            //循环遍历，将请求的参数封装到请求参数的对象之中
            for (let i = 0; i < parameterArray.length; i++) {
                requestParameters[parameterArray[i].split('=')[0]] = decode((parameterArray[i].split('=')[1]));
            }
        }
        return requestParameters;
    }
}