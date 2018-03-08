'use strict';

enum E {
    X, Y, Z
}

function f(obj: { X: number }) {
    return obj.X;
}

console.log(f(E));

declare enum F {
    A = 1,
    B,
    C = 2
}

console.log(F.A);
