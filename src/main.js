"use strict";
exports.__esModule = true;
var greet_1 = require("./greet");
function showHello(divName, name) {
    var el = document.getElementById(divName);
    el.innerText = greet_1.sayHello(name);
}
var name = "Peng Hailin, Have a good day!";
var hexLiteral = '0xe80d';
showHello("greeting", name + hexLiteral);
