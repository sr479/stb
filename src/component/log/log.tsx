
import "./log.less";
import { React } from "../../framework/component/react";
import { SetTimeout } from "../../framework/basic/setTimeout";
import { ReactDOM } from "../../framework/component/react-dom";
import { Config } from "../../config";

/**
 * 提示框组件
 */

interface ILogProps {
    message: string[];
}
interface ILogState {
}

class LogModule extends React.Component<ILogProps, ILogState>{

    constructor(props: ILogProps) {
        super(props);
    }
    render() {
        return (
            <div class="log-component">
                {
                    this.props.message.map((v) => {
                        return (<div>{v}</div>)
                    })
                }
            </div>
        );
    }
}

export class LogComponent {
    private readonly log;
    private readonly msgs = [];
    private readonly ele;

    constructor(id: string) {
        if (Config.debugMode) {
            this.ele = document.getElementById(id);
        }
    }
    push(msg: string) {
        if (Config.debugMode) {
            this.msgs.push(msg);
            ReactDOM.render(<LogModule message={this.msgs} />, this.ele);
        }
    }
}