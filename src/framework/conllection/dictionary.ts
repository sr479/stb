export class Dictionary<T=any> {
    private items: any = {};
    public set(key: string | number, value: T): void {
        this.items[`${key}`] = value;
    }
    public remove(key: string | number): boolean {
        if (this.has(key)) {
            delete this.items[`${key}`];
            return true;
        } else {
            return false;
        }
    }
    public has(key: string | number): boolean {
        return `${key}` in this.items;
    }
    public get(key: string | number): T {
        return this.has(key) ? this.items[`${key}`] : undefined;
    }
    public clear(): void {
        this.items = {};
    }
    public size(): number {
        var count = 0;
        for (var prop in this.items) { //{5} 
            if (this.items.hasOwnProperty(prop)) //{6} 
                ++count; //{7} 
        }
        return count;
    }
    public keys(): Array<string> {
        let values = [];
        for (var k in this.items) {
            if (this.has(k)) {
                values.push(k);
            }
        }
        return values;
    }
    public values(): Array<T> {
        let values = [];
        for (var k in this.items) {
            if (this.has(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }
    public getItems(): object {
        return this.items;
    }
}