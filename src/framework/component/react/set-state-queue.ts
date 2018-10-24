import { renderComponent } from "../react-dom/diff";
import { Extend } from "../../basic/extend";

const setStateQueue = [];
const renderQueue = [];

function defer(fn) {
    return Promise.resolve().then(fn);
}

export function enqueueSetState(stateChange, component) {

    if (setStateQueue.length === 0) {
        defer(flush);
    }
    setStateQueue.push({
        stateChange,
        component
    });

    if (!renderQueue.some(item => item === component)) {
        renderQueue.push(component);
    }
}

function flush() {
    let item, component;
    while (item = setStateQueue.shift()) {

        const { stateChange, component } = item;

        // 如果没有prevState，则将当前的state作为初始的prevState
        if (!component.prevState) {

            // component.prevState = Object.assign( {}, component.state );
            component.prevState = Extend(false, {}, component.state);
        }

        // 如果stateChange是一个方法，也就是setState的第二种形式
        if (typeof stateChange === 'function') {

            // Object.assign( component.state, stateChange( component.prevState, component.props ) );
            Extend(false, component.state, stateChange(component.prevState, component.props));

        } else {
            // 如果stateChange是一个对象，则直接合并到setState中
            // Object.assign( component.state, stateChange );
            Extend(false, component.state, stateChange);

        }

        component.prevState = component.state;

        // TODO 子类调用父类 setState 导致无法触发 renderComponent，这里打个补丁
        if(!renderQueue.length){
            renderQueue.push(component);
        }
    }

    while (component = renderQueue.shift()) {

        renderComponent(component);

    }
}
