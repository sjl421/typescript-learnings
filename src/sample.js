'use strict';
/// <reference path="Validation.ts">
var Validation;
(function (Validation) {
    var lettersRegexp = /^[A-Za-z]+$/;
    var LettersOnlyValidator = /** @class */ (function () {
        function LettersOnlyValidator() {
        }
        LettersOnlyValidator.prototype.isAcceptable = function (s) {
            return lettersRegexp.test(s);
        };
        return LettersOnlyValidator;
    }());
    Validation.LettersOnlyValidator = LettersOnlyValidator;
})(Validation || (Validation = {}));
/// <reference path="Validation.ts">
var Validation;
(function (Validation) {
    var numberRegexp = /^[0-9]+$/;
    var ZipCodeValidator = /** @class */ (function () {
        function ZipCodeValidator() {
        }
        ZipCodeValidator.prototype.isAcceptable = function (s) {
            return s.length === 5 && numberRegexp.test(s);
        };
        return ZipCodeValidator;
    }());
    Validation.ZipCodeValidator = ZipCodeValidator;
})(Validation || (Validation = {}));
/// <reference path="Validation.ts">
/// <reference path="LettersOnlyValidator.ts">
/// <reference path="ZipCodeValidator.ts">
// 一些尝试样本
var strings = ["Hello", "98052", "101"];
// 要使用的验证器
var validators = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();
// 展示各个字符串是否通过各个验证器验证
for (var _i = 0, strings_1 = strings; _i < strings_1.length; _i++) {
    var s = strings_1[_i];
    for (var name_1 in validators) {
        var isMatch = validators[name_1].isAcceptable(s);
        console.log("\"" + s + "\" " + (isMatch ? "matches" : "does not match") + " \"" + name_1 + "\".");
    }
}
