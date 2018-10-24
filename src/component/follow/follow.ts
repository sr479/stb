import { HElement } from "../../framework/basic/helement";
import { Position } from "../../framework/basic/position";

/**
 * 跟随组件
 * @description 元素随交代滚动
 */
export class Follow {
    private readonly boxname: string;
    private readonly tarname: string;

    private boxarea: { left, top, right, bottom, width, height };
    private tararea: { left, top, right, bottom, width, height };

    constructor(boxname: string, target: string) {
        this.boxname = boxname;
        this.tarname = target;
    }

    toMove(ele: HElement, set?: { complete?: () => void }) {
        if (!this.boxarea) {
            this.boxarea = Position(document.getElementById(this.boxname));
        }
        if (!this.tararea) {
            this.tararea = Position(document.getElementById(this.tarname));
        }
        let curarea = Position(ele.get(0));

        // 是否超出可视区
        if (curarea.top < this.boxarea.top) {

            this.tararea.top = this.tararea.top + (this.boxarea.top - curarea.top);

        }
        // 如果超出计算超出部分值
        else if (curarea.bottom > this.boxarea.bottom) {

            this.tararea.top = this.tararea.top - (curarea.bottom - this.boxarea.bottom);

        }

        Velocity(document.getElementById(this.tarname), "stop");
        Velocity(document.getElementById(this.tarname), {
            top: `${this.tararea.top}px`
        }, {
                duration: 250,
                complete: () => {
                    (set && set.complete) && set.complete();
                }
            });
    }
    getStatus() {
        if (!this.tararea) {
            this.tararea = Position(document.getElementById(this.tarname));
        }
        return this.tararea.top;
    }
    setStatus(status: number) {
        let ele = new HElement(`#${this.tarname}`);
        if (ele && ele.length) {
            if (!this.tararea) {
                this.tararea = Position(document.getElementById(this.tarname));
            }
            this.tararea.top = status;
            ele.style("top", `${this.tararea.top}px`);
        }
    }
}