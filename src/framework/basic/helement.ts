/**
 * @name 对 HTMLElement 对象的封装
 */
export class HElement implements IHElement {
    private readonly eles: HTMLElement[] = [];

    public readonly length: number = 0;

    constructor(eleName: string);
    constructor(htmlElement: HTMLElement);
    constructor(htmlElements: HTMLElement[]);
    constructor(eleName: string | HTMLElement | HTMLElement[]) {

        let getHtmlElements = (eleName: string): HTMLElement[] => {
            if (!eleName)
                return [];
            let eles: HTMLElement[] = [];
            //接收的document类型(可扩展)
            let char = eleName.substring(0, 1);
            let charV = eleName.substring(1, eleName.length);

            if (char === '#') {
                let ele = document.getElementById(charV);
                if (ele) {
                    eles.push(document.getElementById(charV));
                }
            } else if (char === '.') {
                let data = document.getElementsByClassName(charV), len = data.length;
                for (let i = 0; i < len; i++) {
                    eles.push(<HTMLElement>data.item(i));
                }
            }
            return eles;
        }

        let name: string;
        let eles: HTMLElement[] = [];

        if (typeof eleName === 'string') {
            name = eleName;
            eles = getHtmlElements(eleName);
        }
        else if (eleName instanceof Array) {
            eles = eleName;
        }
        else {
            name = eleName.id;
            eles.push(eleName);
        }

        if (eles && eles.length) {
            this.length = eles.length;
            this.eles = eles;
        }
    }
    addClass(clasName: string): this {
        let eles = this.eles;
        if (eles && eles.length) {
            let keyName = clasName || null;

            if (keyName && keyName.trim()) {

                let data = eles;

                data.forEach((v) => {

                    let arr = v.className.split(" ") || [], len_2 = arr.length;
                    for (let i_2 = 0; i_2 < len_2; i_2++) {
                        const item = arr[i_2];
                        if (item == clasName) {
                            delete arr[i_2];
                            break;
                        }
                    }
                    // 添加
                    arr.push(clasName);
                    v.className = arr.join(" ").trim();
                });
            }
        }
        return this;
    }
    removeClass(): this;
    removeClass(clasName: string): this;
    removeClass(clasName?: string): this {
        let eles = this.eles;
        if (eles && eles.length) {
            let keyName = clasName || null;

            if (keyName && keyName.trim()) {

                let data = eles;

                data.forEach((v) => {

                    let arr = v.className.split(" ") || [], len_2 = arr.length;
                    for (let i = 0; i < len_2; i++) {
                        const item = arr[i];
                        if (item == clasName) {
                            delete arr[i];
                            v.className = arr.join(" ").trim();

                            // 取值为空删除节点属性
                            if ("" === v.className.trim() && v.hasAttribute("class") && v.removeAttributeNode) {
                                v.removeAttributeNode(v.getAttributeNode("class"));
                            }
                            break;
                        }
                    }

                });

            } else {
                eles.forEach((v) => {
                    v.className = "";
                });
            }
        }
        return this;
    }
    html(): string;
    html(html: string): this;
    html(html?: string): this | string {
        let eles = this.eles;
        if (eles && eles.length) {
            if (html || html === '' || html === "") {
                eles.forEach((v) => {
                    v.innerHTML = html;
                });
            } else {
                return eles[0].innerHTML;
            }
        }
        return this;
    }
    text(): string;
    text(text: string): this;
    text(text?: string): this | string {
        let eles = this.eles;
        if (text || text === '' || text === "") {
            eles.forEach((v) => {
                v.innerText = text;
            });
            return this;
        } else {
            return eles[0].innerText;
        }
    }
    style(propName: string): string;
    style(propName: string, value: string): this;
    style(propName: string, value?: string): this | string {
        let eles = this.eles;

        if (eles && eles.length) {

            if (undefined === value) {
                return eles[0].style.getPropertyValue(propName);
            } else {

                eles.forEach((v) => {

                    if (!v.hasAttribute('style')) {
                        v.setAttribute('style', '');
                    }

                    v.style.setProperty(propName, value);
                });
            }
        }
        return this;
    }
    removeStyle(): this;
    removeStyle(propertyName: string): this;
    removeStyle(propertyName?: string) {
        let eles = this.eles;
        if (eles && eles.length) {

            if (undefined === propertyName) {
                eles.forEach((v) => {
                    v.setAttribute("style", "");
                });
            } else {
                eles.forEach((v) => {
                    v.style.removeProperty(propertyName);
                });
            }
        }
        return this;
    }
    attr(name: string): string;
    attr(name: string, value: string): this;
    attr(name: string, value?: string): this | string {
        let eles = this.eles;

        if (undefined === value) {
            return eles[0].getAttribute(name);
        } else {
            eles.forEach((v) => {
                v.setAttribute(name, value);
            });
        }
        return this;
    }
    removeAttr(name: string): this {
        let eles = this.eles;
        eles.forEach((v) => {
            v.removeAttribute(name);
        });
        return this;
    }
    show(): this {
        let eles = this.eles;
        eles.forEach((v) => {
            if (!v.hasAttribute('style')) {
                v.setAttribute('style', '');
            }
            v.style.setProperty('display', 'block');
        });
        return this;
    }
    hide(): this {
        let eles = this.eles;
        eles.forEach((v) => {
            if (!v.hasAttribute('style')) {
                v.setAttribute('style', '');
            }
            v.style.setProperty('display', 'none');
        });
        return this;
    }
    hidden(): this {
        let eles = this.eles;
        eles.forEach((v) => {
            if (!v.hasAttribute('style')) {
                v.setAttribute('style', '');
            }
            v.style.setProperty('visibility', 'hidden');
        });
        return this;
    }
    visible(): this {
        let eles = this.eles;
        eles.forEach((v) => {
            if (!v.hasAttribute('style')) {
                v.setAttribute('style', '');
            }
            v.style.setProperty('visibility', 'visible');
        });
        return this;
    }
    hasClass(clasName: string): boolean {
        let name = this.eles[0].className || "";

        if (clasName && name) {
            return name.indexOf(clasName) === -1 ? false : true;
        } else {
            return false;
        }
    }
    children(): IHElement;
    children(keyword: string): IHElement;
    children(keyword?: string): IHElement {

        let eles = this.eles, retuList: HTMLElement[] = [], tagName: string, className: string;

        if (keyword) {

            keyword = keyword.replace(/\s/g, "");

            tagName = keyword.toUpperCase(), className = "." === keyword.substr(0, 1) ? keyword.substr(1, keyword.length) : "";

        }

        eles.forEach((v) => {
            let data = v.childNodes, len = data.length, item: any;

            // nodeType
            for (let i = 0; i < len; i++) {
                item = data[i];
                if (item.nodeType === 1) {
                    // all children node
                    if (undefined === keyword) {
                        retuList.push(item);
                    }
                    // className
                    else if (className) {
                        if (item.className && className === item.className) {
                            retuList.push(item);
                        }
                    }
                    // assign type node
                    else {
                        // tag name
                        if (tagName === item.tagName) {
                            retuList.push(item);
                        }
                    }
                }
            }
        });
        return new HElement(retuList);
    }
    eq(index: number): HElement {
        return new HElement(this.eles[index]);
    }
    get(): HTMLElement[];
    get(index: number): HTMLElement;
    get(index?: number) {
        if (undefined !== index) {
            return this.eles[index];
        } else {
            return this.eles;
        }
    }
    eqAll(): IHElement[] {
        let eles: IHElement[] = [];
        this.eles.forEach((v, i) => {
            eles.push(new HElement(this.eles[i]));
        })
        return eles;
    }
    getAll(): HTMLElement[] {
        return this.eles;
    }
    find(keyword: string): IHElement {

        let htmls: HTMLElement[] = [];
        // 属性
        if (keyword.substr(0, 1) === "[") {

            let arr = keyword.replace("[", "").replace("]", "").split("=");
            let attr = arr[0], val = arr[1];

            let eles = this.eles;

            let findAttr = function (ele: HTMLElement) {
                let chils = ele.children, len = chils ? chils.length : 0;

                for (let i = 0; i < len; i++) {

                    if (chils && chils.length && chils.item) {
                        let item = chils.item(i);

                        if (item.getAttribute(attr) && val === item.getAttribute(attr)) {

                            htmls.push(<any>item);
                        }
                        // has children node
                        if (item.children.length) {
                            findAttr(<any>item);
                        }
                    }
                }
            }
            this.eles.forEach((v) => {
                findAttr(v);
            });

        }

        return new HElement(htmls);
    }
}