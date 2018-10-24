export class Set {
    private items: any = {};
    /**
     * 向集合添加一个新的项
     * @param value 
     */
    public add(value: any) {
        if (!this.has(value)) {
            this.items[value] = value;
            return true;
        }
    }
    /**
     * 从集合移除一个值
     * @param value 
     */
    public remove(value: string) {
        if (this.has(value)) {
            delete this.items[value];
            return true;
        }
        return false;
    }
    /**
     * 如果值在集合中，返回true，否则返回false
     * @param value 
     */
    public has(value: string) {
        return this.items.hasOwnProperty(value);
    }
    /**
     * 移除集合中的所有项
     */
    public clear() {
        this.items = {};
    }
    /**
     * 返回集合所包含元素的数量。与数组的length属性类似
     */
    public size() {
        var count = 0;
        for (var prop in this.items) { //{5} 
            if (this.items.hasOwnProperty(prop)) //{6} 
                ++count; //{7} 
        }
        return count;
    }
    /**
     * 返回一个包含集合中所有值的数组
     */
    public values(): any[] {
        var keys: any[] = [];
        for (var key in this.items) { //{7} 
            keys.push(<any>key); //{8} 
        }
        return keys;
    }
    public union(otherSet: Set): Set {
        let unionSet = new Set();

        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            unionSet.add(values[i]);
        }

        values = otherSet.values();
        for (let i = 0; i < values.length; i++) {
            unionSet.add(values[i]);
        }
        return unionSet;
    }
    public intersection(otherSet: Set) {
        let intersectionSet = new Set();
        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            if (otherSet.has(values[i])) {
                intersectionSet.add(values[i]);
            }
        }
        return intersectionSet;
    }
    public difference(otherSet: Set) {
        let differenceSet = new Set();
        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            if (!otherSet.has(values[i])) {
                differenceSet.add(values[i]);
            }
        }
        return differenceSet;
    }
    public subset(otherSet: Set) {
        if (this.size() > otherSet.size()) {
            return false;
        } else {
            let values = this.values();
            for (let i = 0; i < values.length; i++) {
                if (!otherSet.has(values[i])) {
                    return false;
                }
            }
            return true;
        }
    }
}