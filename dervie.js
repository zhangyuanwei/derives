(function(global) {

    var slice = Array.prototype.slice,
        toString = Object.prototype.toString;

    function isFunction(obj) {
        return '[object Function]' == toString.call(obj);
    }

    function bindThis(fn, thisObj) {
        return function() {
            return fn.apply(thisObj, arguments);
        };
    }

    function wrapSuper(subFn, superFn) {
        return isFunction(superFn) ? function() {
            var _super = bindThis(superFn, this),
                args = slice.call(arguments);
            args.unshift(_super);
            return subFn.apply(this, args);
        } : function() {
            var args = slice.call(arguments);
            args.unshift(undefined);
            return subFn.apply(this, args);
        };
    }

    function derive(superClass, constructor, proto) {

        var subClass;

        if (constructor) {
            subClass = wrapSuper(constructor, superClass);
        } else {
            subClass = function() {
                return superClass.apply(this, arguments);
            };
        }

        if (this instanceof derive) {
            // subClass.prototype
            var key, value, oldValue, cp;

            if (constructor) {
                cp = constructor.prototype;
                for (key in cp) {
                    oldValue = this[key];
                    value = cp[key];
                    this[key] = isFunction(value) ? wrapSuper(value, oldValue) : value;
                }
            }

            if (proto) {
                for (key in proto) {
                    oldValue = this[key];
                    value = proto[key];
                    this[key] = isFunction(value) ? wrapSuper(value, oldValue) : value;
                }
            }

            this.constructor = cp ? cp.constructor : superClass;

        } else {
            var tmpProto = derive.prototype;
            derive.prototype = superClass.prototype;
            subClass.prototype = new derive(superClass, constructor, proto);
            derive.prototype = tmpProto;
            return subClass;
        }
    }



    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = derive
    } else {
        global["derive"] = derive;
    }


})(this);
