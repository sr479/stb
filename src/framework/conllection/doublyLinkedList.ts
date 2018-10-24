export class DoublyLinkedNode<T> {
    element: any;
    next: any;
    prev: any; // 新增的
    constructor(element: any) {
        this.element = element;
        this.next = null;
        this.prev = null;
    }
}
/**
 * @name 双向链表
 */
export class DoublyLinkedList<T> {
    private length = 0;
    private head: DoublyLinkedNode<T> = null;
    private tail: DoublyLinkedNode<T> = null; // 新增的

    /**
     * 向列表尾部添加一个新的项
     * @param element 
     */
    public append(element: T) {
        let node = new DoublyLinkedNode(element), current;

        if (this.head === null) {
            this.head = node;
        } else {
            current = this.head;

            // 循环列表，知道找到最后一项
            while (current.next) {
                current = current.next;
            }

            // 找到最后一项，将其next赋为node，建立链接
            current.next = node;
            this.tail = node;
            this.tail.prev = current;
        }
        this.length++; // 更新列表长度    
    }
    /**
     * 向列表的特定位置插入一个新的项
     * @param position 
     * @param element 
     */
    public insert(position: number, element: T) {
        // 检查越界值
        if (position >= 0 && position <= this.length) {
            let node = new DoublyLinkedNode(element),
                current = this.head,
                previous,
                index = 0;

            if (position === 0) { // 在第一个位置添加
                if (!this.head) { // 新增的
                    this.head = node;
                    this.tail = node;
                } else {
                    node.next = current;
                    current.prev = node; // 新增的
                    this.head = node;
                }
            } else if (position === this.length) { // 最后一项 新增的
                current = this.tail;
                current.next = node;
                node.prev = current;
                this.tail = node;
            } else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;

                current.prev = node; // 新增的
                node.prev = previous; // 新增的
            }
            this.length++; // 更新列表长度
            return true;
        } else {
            return false;
        }
    }
    /**
     * 从列表的特定位置移除一项
     * @param position 
     */
    public removeAt(position: number) {
        // 检查越界值
        if (position > -1 && position < this.length) {
            let current = this.head,
                previous,
                index = 0;

            // 移除第一项
            if (position === 0) {
                this.head = current.next;

                // 如果只有一项，更新tail // 新增的
                if (this.length === 1) {
                    this.tail = null;
                } else {
                    this.head.prev = null;
                }
            }
            else if (position === this.length - 1) { // 新增的
                current = this.tail;
                this.tail = current.prev;
                this.tail.next = null;
            }
            else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                // 将previous与current的下一项链接起来：跳过current，从而移除它
                previous.next = current.next;
                current.next.prev = previous; // 新增的
            }
            this.length--;
            return current.element;
        } else {
            return null;
        }
    }
    /**
     * 从列表中移除一项
     * @param element 
     */
    public remove(element: T) {
        let index = this.indexOf(element);
        return this.removeAt(index);
    }
    /**
     * ：返回元素在列表中的索引。如果列表中没有该元素则返回-1
     * @param element 
     */
    public indexOf(element: T) {
        let current = this.head,
            index = -1;

        while (current) {
            if (element === current.element) {
                return index;
            }
            index++;
            current = current.next;
        }
        return -1;
    }
    /**
     * 如果链表中不包含任何元素， 返回true， 如果链表长度大于0则返回false
     */
    public isEmpty() {
        return this.length === 0;
    }
    /**
     * 返回链表包含的元素个数。与数组的length属性类似
     */
    public size() {
        return this.length;
    }
    /**
     * 由于列表项使用了Node类，就需要重写继承自JavaScript对象默认的toString方法，让其只输出元素的值
     */
    public toString() {
        let current = this.head,
            string = '';

        while (current) {
            string += current.element;
            current = current.next;
        }
        return string;
    }
    public getHead() {
        return this.head;
    }
    public getTail() {
        return this.tail;
    }
    public print() {
        console.log(this.toString());
    }
}