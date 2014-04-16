(function(global, undefined) {
    var magicNumber = 0x773e59b3,
        toString = Object.prototype.toString,
        slice = Array.prototype.slice;

    function isFunction(obj) {
        return toString.call(obj) === "[object Function]";
    }

    function derives(superClass, constructor, proto) {

        superClass = superClass || Object;

        var _constructor = constructor || superClass;

        function subClass() {
            return _constructor.apply(this, arguments);
        }

        if (this instanceof derives) {
            // subClass.prototype
            var cp, key;

            if (constructor) {
                cp = constructor.prototype;
                for (key in cp) {
                    this[key] = cp[key];
                }
            }

            if (proto) {
                if (isFunction(proto)) {
                    proto = proto();
                }
                for (key in proto) {
                    this[key] = proto[key];
                }
            }

            this.constructor = cp ? cp.constructor : superClass;

        } else {
            var tmpProto = derives.prototype;
            derives.prototype = superClass.prototype;
            subClass.prototype = new derives(superClass, constructor, proto);
            derives.prototype = tmpProto;
            subClass._super = superClass;
            subClass._derives = {
                magicNumber: magicNumber,
                constructor: constructor,
                proto: proto
            };
            return subClass;
        }
    }


    function _to_json(obj) {
        var type = toString.call(obj).replace(/\[object (.+)\]/, "$1"),
            ret = [],
            buf, i, j;

        switch (type) {
            case "Object":
                buf = [];
                for (i in obj) {
                    buf.push(_to_json(i) + ":" + _to_json(obj[i]));
                }
                ret.push("{", buf.join(","), "}");
                break;
            case "Array":
                buf = [];
                j = obj.length;
                for (i = 0; i < j; i++) {
                    buf.push(_to_json(obj[i]));
                }
                ret.push("[", buf.join(","), "]");
                break;
            case "Function":
                ret.push("(", obj.toString(), ")");
                break;
            case "String":
                ret.push(["\"", obj.replace(/[\\\n\r\t'"]/g, "\\$1"), "\""].join(""));
                break;
            case "Date":
            case "Error":
                //TODO
                ret.push("undefined");
                break;
            case "Null":
            case "Undefined":
            case "Number":
            case "Boolean":
            case "RegExp":
            default:
                ret.push(String(obj));
                break;
        }
        return ret.join("");
    }

    derives.export = function(klass, superClassName) {
        var output = [];
        if (klass === undefined) {
            output.push("(function(){\n");
            output.push("var magicNumber = 0x", magicNumber.toString(16), ",\n");
            output.push("    toString = Object.prototype.toString,\n");
            output.push("    slice = Array.prototype.slice;\n");
            output.push(isFunction.toString(), "\n");
            output.push(derives.toString(), "\n");
            output.push(_to_json.toString(), "\n");
            output.push("derives.export = ", derives.export.toString(), ";\n");
            output.push("return derives;\n");
            output.push("})()");
        } else if (klass && klass._derives && (klass._derives.magicNumber === magicNumber)) {
            output.push("derives(", (superClassName || "null"), ",");
            output.push(klass._derives.constructor ? klass._derives.constructor.toString() : "null", ",");
            output.push(klass._derives.proto ? _to_json(klass._derives.proto) : "null");
            output.push(")");
        } else {
            throw new Error("Not a derivesd class");
        }
        return output.join("");
    };


    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = derives;
    } else {
        global["derives"] = derives;
    }

})(this);
