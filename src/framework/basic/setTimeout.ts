export class SetTimeout {
    private timer: any;
    private timeOut: any;

    constructor(time = 0) {
        if (time >= 1) {
            this.timeOut = time;
        }
    }
    enable = (action: Function) => {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            action();
        }, this.timeOut);
    }
    clear = () => {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
}