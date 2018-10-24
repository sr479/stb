/**
 * 
 * @param list 
 * @param start 
 * @description 
 */
export class CutoutDataList{
    private readonly dataList = [];
    private readonly size:number = 0;
    private startAt:number = 0;
    private readonly range:number = 0;

    constructor(list:any[],range:number){
        this.startAt = 0;
        this.dataList = list;
        this.size = list.length;
        this.range = range;
    }
    getIndex(){
        return this.startAt;
    }
    setIndex(startAt:number){
        this.startAt = startAt;
    }
    getRange(){
        return this.range;
    }
    getAt(startAt:number){
        if(this.checkout(startAt)){
            this.startAt = startAt;

            let rlist = [],len = this.dataList.length;

            for (let i = 0; i < len; i++) {
                if(startAt <= i){
                    rlist.push(this.dataList[i]);
                }
            }

            return rlist;
        }
        return [];
    }
    getSize(){
        return this.dataList.length;
    }
    checkout(startAt:number){
        return (this.dataList && this.dataList.length && startAt >= 0 && startAt < this.size) ? true : false;
    }
    toBehind() {
        let start = (1 + this.startAt) > this.size ? this.startAt : ++this.startAt;
        return this.getAt(start);
    }
    isBehind(): boolean {
        return (1 + this.startAt) > (this.size - this.range) ? false : true;
    }
    toFront() {
        let start =  (-1 + this.startAt) < 0 ? this.startAt : --this.startAt;
        return this.getAt(start);
    }
    isFront(): boolean {
        return (-1 + this.startAt) < 0 ? false : true;
    }
}