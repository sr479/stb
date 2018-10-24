export class Clone<T>{
    private object: any;
    constructor(object: Array<object> | object) {
        this.object = object;
    }
    getResult = (): T => {
        return this.clone(this.object);
    }
    private clone(object: Array<object> | object | any): any {
        let a: any;
        if (object instanceof Array) {
            a = [];
            for (let i = 0; i < object.length; i++) {
                a.push(this.clone(object[i]))
            }
        } else if (object instanceof Function) {
            return eval('(' + object.toString() + ')')
        } else if (object instanceof Object) {
            a = {};
            for (let i in object) {
                a[i] = this.clone(object[i])
            }
        } else {
            return object;
        }
        return a;
    }
}