
import "./form.less";
import { React } from "../../framework/component/react";
import { SetTimeout } from "../../framework/basic/setTimeout";
import { ReactDOM } from "../../framework/component/react-dom";

/**
 * 提示框组件
 */

interface IFormProps {
    props: any;
    method: "POST" | "GET";
    action: string;
}
interface IFormState {
}

class FormModule extends React.Component<IFormProps, IFormState>{

    constructor(props: IFormProps) {
        super(props);
    }
    render() {

        let group: { key, value }[] = [];

        for (const key in this.props.props) {
            if (this.props.props.hasOwnProperty(key)) {
                const ele = this.props.props[key];

                group.push({ key: key, value: ele });
            }
        }

        return (
            <form class="form-component" action={this.props.action} method={this.props.method}>
                {
                    group.map((v) => {
                        return (
                            <input type="text" name={v.key} value={v.value} />
                        )
                    })
                }
                <input type="submit" value="提交" />
            </form>
        );
    }
    componentDidMount() {

        new SetTimeout(300).enable(() => {
            this.refs.find("[type=submit]").get(0).click();
        })


    }
}
export class FormComponent {
    private readonly log;
    private readonly msg: string;
    private readonly ele;

    private props: any;

    constructor(id: string) {
        this.ele = document.getElementById(id);
        this.props = {};
    }
    setProps(props) {
        this.props = props;
    }

    post(params: {
        method: "POST" | "GET",
        action: string;
    }) {
        let prp = this.props;

        let req: any = {
            props: this.props,
            ...params
        }

        ReactDOM.render(<FormModule {...req} />, this.ele);
    }


}