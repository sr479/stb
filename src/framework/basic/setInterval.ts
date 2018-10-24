export class SetInterval {
    private timer: any;
    private timeOut: any;
    constructor(time = 0) {
        if (time >= 1) {
            this.timeOut = time;
        }
    }
    enable = (method: Function) => {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            method();
        }, this.timeOut);
    }
    clear = () => {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}