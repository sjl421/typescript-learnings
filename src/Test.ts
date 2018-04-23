/// <reference path="Validation.ts">
/// <reference path="LettersOnlyValidator.ts">
/// <reference path="ZipCodeValidator.ts">

// 一些尝试样本
let strings = ["Hello", "98052", "101"];

// 要使用的验证器
let validators: { [s: string]: Validation.StringValidator; } = {};

validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();


// 展示各个字符串是否通过各个验证器验证
for (let s of strings) {
    for (let name in validators) {
        let isMatch = validators[name].isAcceptable(s);
        console.log(`"${ s }" ${ isMatch ? "matches" : "does not match" } "${ name }".`);
    }
}
