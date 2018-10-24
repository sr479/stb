export function Extend(deep: any, target: any, options: any) {
    var copyIsArray: any;
    var toString = Object.prototype.toString;
    var hasOwn = Object.prototype.hasOwnProperty;

    var class2type: any = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Object]': 'object'
    };

    var type = function (obj: any) {
        return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
    };

    var isWindow = function (obj: any) {
        return obj && typeof obj === "object" && "setInterval" in obj;
    };

    var isArray = Array.isArray || function (obj) {
        return type(obj) === "array";
    };

    var isPlainObject = function (obj: any) {
        if (!obj || type(obj) !== "object" || obj.nodeType || isWindow(obj)) {
            return false;
        }

        if (obj.constructor && !hasOwn.call(obj, "constructor")
            && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
        }

        var key;
        for (key in obj) {
        }

        return key === undefined || hasOwn.call(obj, key);
    };

    var extend = function (deep: any, target: any, options: any) {
        for (let name in options) {
            let src = target[name];
            let copy = options[name];

            if (target === copy) { continue; }

            if (deep && copy
                && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                let clone;
                if (copyIsArray) {
                    copyIsArray = false;
                    clone = src && isArray(src) ? src : [];

                } else {
                    clone = src && isPlainObject(src) ? src : {};
                }

                target[name] = extend(deep, clone, copy);
            } else if (copy !== undefined) {
                target[name] = copy;
            }
        }
        return target;
    };

    return extend(deep, target,options);
}