export class FormatUrl {
    private url: any;
    private params: any;
    constructor(url: string, params: Object) {
        this.url = url;
        this.params = params;
    }
    getURL() {
        return this.encodeURL();
    }
    getEncodeURI() {
        return this.encodeURL(encodeURI);
    }
    getEncodeURIComponent() {
        return this.encodeURL(encodeURIComponent);
    }
    private encodeURL(encode?: any): string {
        let url = this.url;
        let params = this.params;

        if (!encode) {
            encode = function (str: string) {
                return str;
            }
        }

        // 初始化当前参数
        let charIdx = url.indexOf("?");
        if (charIdx != -1) {
            url = url.substr(0, charIdx);
        }

        let newUrl = "?";
        if (params) {
            for (let item in params) {
                if (params.hasOwnProperty(item)) {
                    var element = encode(params[item]);
                    newUrl += item + '=' + element + '&'
                }
            }
            url += newUrl.substr(0, newUrl.length - 1);
        }
        return url || null;
    }
}