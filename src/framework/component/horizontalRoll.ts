import { HElement } from "../basic/helement";
import { SetTimeout } from "../basic/setTimeout";
import { SetInterval } from "../basic/setInterval";

/**
 * @name 走马灯
 */
export class HorizontalRoll {
    private readonly box: HElement | IHElement;
    private readonly marquee: HElement | IHElement;
    private innerHtml: string;

    private marginLeft = 0;
    private out = new SetTimeout(200);
    private timer = new SetInterval(30);

    constructor(ele: IHElement) {
        this.box = ele;
        this.marquee = new HElement(document.createElement('div'));
        // 预先设置，保证宽度的取值效果
        this.box.style("white-space", 'nowrap');
    }
    enable() {
        this.marginLeft = 0;
        this.out.clear();
        this.timer.clear();

        let ele = this.box.get(0), scrollWidth = ele.scrollWidth, clientWidth = ele.clientWidth, isFirst = true;
        let marquee = <HTMLMarqueeElement>this.marquee.get(0);
        this.innerHtml = this.box.html();

        if (ele.scrollWidth > ele.clientWidth) {

            this.box.style("position", 'relative');
            this.marquee.attr('style', "position:absolute;left:0;top:0;");

            this.out.enable(() => {
                this.timer.enable(() => {
                    this.marginLeft -= 2;
                    if ((-scrollWidth) > this.marginLeft) {
                        if (!isFirst) {
                            this.marginLeft = clientWidth;
                        } else {
                            isFirst = false;
                        }
                    }
                    this.marquee.style('left', `${this.marginLeft}px`);
                });
            });

            // 装载
            this.marquee.html(this.innerHtml);
            this.box.html("");
            ele.appendChild(marquee);
        }
    }
    disable() {
        // 卸载
        this.marginLeft = 0;
        this.out.clear();
        this.timer.clear();
        this.box.html(this.innerHtml);
    }
}