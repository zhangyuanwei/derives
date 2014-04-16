derive<span style="color:red">s</span>
=========

也试着写个派生

## 特性
### <del>1.支持_super</del>
### 2.不污染全局对象
### 3.逻辑比较绕@_@..
### 4.能export函数。。。。

```javascript
var derives = require("derives");

//从Object派生类
var ClassA = derives(null, function(_super) {
    console.log("hello from A");
}, {
    fn: function() {
        //xxx
    }
});

//从ClassA派生ClassB
var ClassB = derives(ClassA, function(_super) {
    ClassA.call(this);
    console.log("hello from B");
}, {
    fn: function(_super) {
        //xxx
    }
});

var b = new ClassB();
b.fn();
```
