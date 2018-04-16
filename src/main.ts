'use strict';
let key1 = Symbol("key1");

let key2 = "key2";

let obj = {
    [key1]: "value1",
    key2: "value2"
};

for (let s of key2) {
    console.log(s)
}
