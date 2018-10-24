import { BaseLogic, RequestInfo, ResponseInfo } from "./baseLogic";
import { Dictionary } from "../framework/conllection/dictionary";
import { Config, getApiAddress } from "../config";

interface IMain {
}

class CommonLogic extends BaseLogic {
    getMainData(data: IMain, callback: (info: ResponseInfo<any>) => void) {
        let url = getApiAddress("main");
        let params = data;

        let request = new RequestInfo(url, data, function (res) {
            res.status = res._response.result.state;
            res.message = res._response.result.reason;
            res.success = 200 == res.status ? true : false;

            if (res.success) {
                const data = res._response.data;
                if (data) {
                    res.data = createModel(data);
                }
            } else {
                // ...
            }
            callback(res);
        });
        var createModel = function (data: any) {
            return data;
        }
        this.syncGet(request);
    }
    
    
}

export { CommonLogic }