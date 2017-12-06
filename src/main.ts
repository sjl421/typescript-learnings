'use strict';

for (var i = 0; i < 10; i++){
    // 这里要捕获到变量`i`的当前状态
    // 是通过触发带有其当前值的一个函数实现的
    // IIFE, Immediately Invoked Function Expression
    (function(i){ 
        setTimeout(function (){
            console.log(i);
        }, 100 * i)
    })(i);
}

for ( let i = 0; i < 10; i++ ) {
    setTimeout(function () {console.log(i)}, 10*i);
}

function f ( [first, second]: [number, number] ) {
    console.log(first);
    console.log(second);
}

f([1, 2]);

let [first, ...remain] = [1, 2, 3, 4];

console.log(first);
console.log(remain);

let o = {
    a: "foo",
    b: 12,
    c: "bar"
};
let {a, ...passthrough} = o;

console.log(passthrough, passthrough.c);

