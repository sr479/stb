import "./default.less";
import { BasePage, PageRegister } from "../../framework/component/page";
import { ParseUrl } from "../../framework/basic/parseUrl";
import { PageSource } from "../../framework/component/pageSource";
import { Cookie } from "../../framework/basic/cookie";

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
interface IPageProps {
}
interface IPageState {
}
class Page extends BasePage<IRequest> {
    init() {
        
    }
    load() {

    }
}

PageRegister(Page, {
    handler: [
        MType.Page
    ],
    request: new ParseUrl(location.search).getDecodeURIComponent(),
    source: new PageSource('default_source'),
    cokStatus: new Cookie('default_status')
});