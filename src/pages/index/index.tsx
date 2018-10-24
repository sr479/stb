import "./index.less";
import { BasePage, PageRegister } from "../../framework/component/page";
import { ParseUrl } from "../../framework/basic/parseUrl";
import { PageSource } from "../../framework/component/pageSource";
import { Cookie } from "../../framework/basic/cookie";
import { ReactDOM } from "../../framework/component/react-dom";
import { PageModule } from "./indexPage";
import { React } from "../../framework/component/react";

enum MType {
    Page
}
interface ISource {
    url: string;
    name: string;
}
interface IOpenBlank {
    url: string;
    memo: IMemo;
}
interface IRequest {
    source_name: string;
}
interface IMemo {
}
export interface IPageProps {
}
export interface IPageState {
}

class Page extends BasePage<IRequest> {
    init() {

    }
    load() {
        // ReactDOM.render(<PageModule />, document.getElementById('page'));
    }
}

PageRegister(Page, {
    handler: [
        MType.Page
    ],
    request: new ParseUrl(location.search).getDecodeURIComponent(),
    source: new PageSource('index_source'),
    cokStatus: new Cookie('index_status')
});