import { diff } from './diff'
import { HElement } from '../../basic/helement';

function _render(vnode, container) {

    if (vnode === undefined) return;

    if (vnode.isReactComponent) {
        const component = vnode;

        if (component._container) {
            if (component.componentWillUpdate) {
                component.componentWillUpdate();
            }
        } else if (component.componentWillMount) {
            component.componentWillMount();
        }

        component._container = container;   // 保存父容器信息，用于更新
        component.refs = new HElement(container);

        vnode = component.render();

    }

    if (typeof vnode === 'string' || typeof vnode === 'number') {

        let textNode = document.createTextNode(<any>vnode);
        return container.appendChild(textNode);
    }

    const dom = document.createElement(vnode.tag);

    if (vnode.attrs) {
        Object.keys(vnode.attrs).forEach(key => {

            const value = vnode.attrs[key];

            if (key === 'className') key = 'class';

            // 如果是事件监听函数，则直接附加到dom上
            if (typeof value === 'function') {
                dom[key.toLowerCase()] = value;
            } else {
                dom.setAttribute(key, vnode.attrs[key]);
            }

        });
    }

    if (vnode.children) {
        vnode.children.forEach(child => _render(child, dom));
    }

    const component = vnode.component;

    let out = container.appendChild(dom);

    component.componentDidMount();

    return out;
}

export function render(vnode, container, dom?) {
    return diff(dom, vnode, container);
}