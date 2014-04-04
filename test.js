var derive = require("./dervie.js");

var ClassA = derive(Object, function(_super) {
    this.name = "A";
    console.log("constructor from ClassA");
    console.log("this.name:", this.name);
}, {
    fn1: function(_super) {
        console.log("fn1 from ClassA arguments.length:", arguments.length);
        console.log("this.name:", this.name);
    }
});

var ClassB = derive(ClassA, function(_super) {
    _super();
    this.name = "B";
    console.log("constructor from ClassB");
    console.log("this.name:", this.name);
}, {
    fn1: function(_super) {
        _super();
        console.log("fn1 from ClassB arguments.length:", arguments.length);
        console.log("this.name:", this.name);
    }
});

var ClassC = derive(ClassB, function(_super) {
    _super();
    this.name = "C";
    console.log("constructor from ClassC");
    console.log("this.name:", this.name);
}, {
    fn1: function(_super) {
        _super();
        console.log("fn1 from ClassC arguments.length:", arguments.length);
        console.log("this.name:", this.name);
    }
});

var ClassD = derive(ClassC, ClassB, {
    fn1: function(_super) {
        _super();
        console.log("fn1 from ClassD arguments.length:", arguments.length);
        console.log("this.name:", this.name);
    }
});


(new ClassC()).fn1();
console.log("--------");
(new ClassD()).fn1();

