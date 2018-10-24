
import "./tips.less";
import { React } from "../../framework/component/react";
import { SetTimeout } from "../../framework/basic/setTimeout";
import { ReactDOM } from "../../framework/component/react-dom";

/**
 * 提示框组件
 */

interface ITipsProps {
    duration?: number;
    message: string;
    close?: () => void;
}
interface ITipsState {
}

class TipsModule extends React.Component<ITipsProps, ITipsState>{
    readonly timeout = new SetTimeout(undefined === this.props.duration ? 3000 : this.props.duration);

    constructor(props: ITipsProps) {
        super(props);
    }
    render() {
        return (
            <div class="tips-component">
                <div>{this.props.message}</div>
            </div>
        );
    }
    componentDidMount() {

        this.refs.show();
        this.timeout.enable(() => {
            this.props.close && this.props.close();
            this.refs.hide();
        });

    }
}
export class TipsComponent {
    private readonly log;
    private readonly msg:string;
    private readonly ele;

    constructor(id:string) {
        this.ele = document.getElementById(id);
    }
    show(msg: string) {
        ReactDOM.render(<TipsModule message={msg} />, this.ele);
    }
}