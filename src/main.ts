'use strict';

function f () {
    var a = 10;

    a = 2;

    var b = g ();

    a = 3;

    return b;

    function g () {
        return a;
    }
}

console.log(f());
