export class FuncLock {
    private _lock = false;
    constructor() {
    }
    enable = (method: Function, failure?: Function) => {
        if (!this._lock) {
            this._lock = true;
            method();
        } else {
            failure && failure();
        }
    }
    lock = () => {
        this._lock = true;
    }
    clear = () => {
        this._lock = false;
    }
}