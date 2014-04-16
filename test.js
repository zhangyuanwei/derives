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
