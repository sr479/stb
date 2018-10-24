import { HElement } from "../basic/helement";
import { Position } from "../basic/position";

/**
 * 可视范围区内滚动，小于最小单元格高度不处理
 */
export class VerticalVisualRangeRoll {
    private readonly elemen: HTMLElement;
    private parent: HTMLElement;
    private firste: HTMLElement;
    private lastel: HTMLElement;
    private top = 0;

    constructor(info: { ele: HElement }) {
        this.elemen = info.ele.get(0);
    }
    toCeil() {
        if (this.isCeil()) {
            this.top += this.firste.clientHeight;
            this.elemen.style.marginTop = this.top + "px";
        }
    }
    toFloor() {
        if (this.isFoor()) {
            this.top -= this.firste.clientHeight;
            this.elemen.style.marginTop = this.top + "px";
        }
    }
    isRoll() {

        if (this.elemen) {
            let ele = Position(this.elemen);
            let box = Position(this.elemen.parentElement);

            return (ele.bottom - ele.top) > (box.bottom - box.top);
        }
        return false;

    }
    isFoor() {

        this.parent = this.elemen.parentElement;
        this.firste = <HTMLElement>this.elemen.children.item(0);
        this.lastel = <HTMLElement>this.elemen.children.item(this.elemen.children.length - 1);

        if (this.lastel && this.parent && this.elemen) {
            let last = Position(this.lastel);
            let boxs = Position(this.parent);

            return parseInt(<any>last.top) >= parseInt(<any>boxs.bottom);
        }
        return false;
    }
    isCeil() {

        this.parent = this.elemen.parentElement;
        this.firste = <HTMLElement>this.elemen.children.item(0);
        this.lastel = <HTMLElement>this.elemen.children.item(this.elemen.children.length - 1);

        if (this.firste && this.parent && this.elemen) {
            let firs = Position(this.firste);
            let boxs = Position(this.parent);

            return parseInt(<any>firs.bottom) <= parseInt(<any>boxs.top);
        }
        return false;
    }
    toSerial(index: number) {
        if (this.isRoll()) {
            this.top = -(this.firste.clientHeight * index);
            this.elemen.style.marginTop = this.top + "px";
        }
    }
}