/**
 * 编写作者:
 * 创建时间:
 */
import "./index.less";
import { BasePage, PageRegister } from "../../framework/component/page";
import { ParseUrl } from "../../framework/basic/parseUrl";
import { PageSource } from "../../framework/component/pageSource";
import { Cookie } from "../../framework/basic/cookie";
import { ReactDOM } from "../../framework/component/react-dom";
import { PageModule } from "./com_page";
import { React } from "../../framework/component/react";
import { Config } from "../../config";
import { PageEvent } from "../../framework/component/pageEvent";
import { Json } from "../../framework/basic/json";
import { FormatUrl } from "../../framework/basic/formatUrl";
import { SetTimeout } from "../../framework/basic/setTimeout";

export const enum MType {
    Page
}

interface ISource {
    url: string;
}
export interface IOpenBlank {
    url: string;
    params: any;
    memo: IMemo;
}
interface IRequest {
    return: string;
}
interface IMemo {
}
export interface IPageProps {
    identCode: MType.Page;
    event: PageEvent;
}
export interface IPageState {
}

class Page extends BasePage<IRequest> {
    init() {
        // 启用来源地址储存支持
        // let source: ISource = {
        //     url: this.request.return || "-1"
        // }
        // this.source.saveToLocal(Json.serializ(source));
    }
    load() {
        // 启用界面恢复状态获取支持
        // let memo: IMemo;
        // if (this.cokStatus.getCookie()) {
        //     memo = Json.deSerializ(this.cokStatus.getCookie());
        // }

        ReactDOM.render(<PageModule identCode={MType.Page} event={this.event} />, document.getElementById('page'));
    }
    openBlank(data: IOpenBlank) {

        const { url, params, memo } = data;

        // 启用界面恢复状态存储支持
        // if (memo) {
        //     this.cokStatus.setCookie(Json.serializ(memo));
        // }

        if (url) {

            // 直接跳转
            // window.location.href = url;

            // 带参数以及返回地址
            // window.location.href = new FormatUrl(url, {
            //     ...params,
            //     return: new FormatUrl("./***.html", { /** 参数设置 */ }).getEncodeURIComponent()
            // }).getEncodeURIComponent();

            // 兼容上报
            // new SetTimeout(300).enable(()=>{

            // })
        }

    }
    openPrevious() {
        let source: ISource = Json.deSerializ(this.source.takeToLocal());

        if (source) {

            const { url } = source;

            // 清除cookie
            this.source.removeToLocal();
            this.cokStatus.clearCookie();

            // 启用返回功能支持
            // if ("-1" === source.url) {

            // } else {
            //     window.location.href = url;
            // }

            // 兼容上报
            // new SetTimeout(300).enable(() => {

            // });

        }
    }
}

PageRegister(Page, {
    handler: [
        MType.Page
    ],
    request: new ParseUrl(location.search).getDecodeURIComponent(),
    source: new PageSource(`${Config.mainCookieName}_index_source`),
    cokStatus: new Cookie(`${Config.mainCookieName}_index_status`)
});
