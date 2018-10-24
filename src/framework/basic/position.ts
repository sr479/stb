export function Position(el: HTMLElement) {
    var box = el.getBoundingClientRect();
    var x = window.pageXOffset;
    var y = window.pageYOffset;

    return {
        top: box.top + y,
        right: box.right + x,
        bottom: box.bottom + y,
        left: box.left + x,
        width:box.width,
        height:box.height
    };
}