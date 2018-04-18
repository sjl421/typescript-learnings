'use strict';
exports.__esModule = true;
var zip = require("./ZipCodeValidator");
// 一些要尝试的示例
var strings = ["hello", "98052", "101"];
// 要使用的验证器
var validator = new zip();
// 给出各个字符串是否通过各个验证器检查
strings.forEach(function (s) {
    console.log("\"" + s + "\" - " + (validator.isAcceptable(s) ? " matches" : "does not match"));
});
