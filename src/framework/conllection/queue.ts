export class Queue {
    items: Array<any> = [];
    public enqueue(element: any) {
        this.items.push(element);
    }
    public dequeue() {
        return this.items.shift();
    }
    public front() {
        return this.items[0];
    }
    public isEmpty() {
        return this.items.length == 0;
    }
    public clear() {
        this.items = [];
    }
    public size() {
        return this.items.length;
    }
    public print() {
        console.log(this.items.toString());
    }
}