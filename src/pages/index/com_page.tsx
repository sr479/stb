/**
 * 编写作者:
 * 创建时间:
 */
import { React } from "../../framework/component/react";
import { IPageProps, IPageState } from ".";

export class PageModule extends React.Component<IPageProps, IPageState>{
    constructor(props: IPageProps) {
        super(props);
    }
    render() {
        return <div class="content">Hello EPG!</div>
    }
}
