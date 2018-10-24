import { Position } from "../basic/position";

/**
 * 可视范围区内滚动，小于最小单元格高度不处理
 */
export class HorizontalVisualRangeRoll {
    private readonly elemen: HTMLElement;
    private parent: HTMLElement;
    private firste: HTMLElement;
    private lastel: HTMLElement;
    private left = 0;
    private clientWidth: number;

    constructor(info: { ele: IHElement, clientWidth?: number }) {
        this.elemen = info.ele.get(0);
        this.clientWidth = info.clientWidth;
    }
    toFront() {
        if (this.isFront()) {
            this.left += this.clientWidth || this.firste.clientWidth;
            this.elemen.style.marginLeft = this.left + "px";
        }
    }
    toBehind() {
        if (this.isBehind()) {
            this.left -= this.clientWidth || this.firste.clientWidth;
            this.elemen.style.marginLeft = this.left + "px";
        }
    }
    isRoll() {

        this.parent = this.elemen.parentElement;
        this.firste = <HTMLElement>this.elemen.children.item(0);
        this.lastel = <HTMLElement>this.elemen.children.item(this.elemen.children.length - 1);

        if (this.parent && this.firste && this.elemen) {
            return (this.elemen.scrollWidth - (this.clientWidth || this.parent.clientWidth) - this.firste.scrollWidth) > 0;
        }
        return false;
    }
    isBehind() {

        this.parent = this.elemen.parentElement;
        this.firste = <HTMLElement>this.elemen.children.item(0);
        this.lastel = <HTMLElement>this.elemen.children.item(this.elemen.children.length - 1);

        if (this.lastel && this.parent && this.elemen) {
            let last = Position(this.lastel);
            let boxs = Position(this.parent);

            return parseInt(<any>last.left) >= parseInt(<any>boxs.right);
        }
        return false;
    }
    isFront() {

        this.parent = this.elemen.parentElement;
        this.firste = <HTMLElement>this.elemen.children.item(0);
        this.lastel = <HTMLElement>this.elemen.children.item(this.elemen.children.length - 1);

        if (this.firste && this.parent && this.elemen) {
            let firs = Position(this.firste);
            let boxs = Position(this.parent);

            return parseInt(<any>firs.right) <= parseInt(<any>boxs.left);
        }
        return false;
    }
    toSerial(index: number) {
        if (this.isRoll()) {
            this.left = -((this.clientWidth || this.firste.clientWidth) * index);
            this.elemen.style.marginLeft = this.left + "px";
        }
    }
}