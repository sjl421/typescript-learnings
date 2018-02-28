'use strict';
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length); // 现在知道`arg`有着一个`.length`属性，因此不再报出错误
    return arg;
}

loggingIdentity("test");

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

console.log(getProperty(x, "a")); // 没有问题
getProperty(x, "m"); // 

