'use strict';
interface Named {
    name: string;
}

// y 所引用的类型是 { name: string; location: string; }
let y = { name: "Alice", location: "Seattle" };

function greet(n: Named) {
    alert("Hello, " + n.name);
}

greet(y);

