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

setTimeout(function() {}, 1000);

for ( let i = 0; i < 10; i++ ) {
    setTimeout(function () {console.log(i)}, 100*i);
}
