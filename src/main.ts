'use strict';

import { StringValidator } from "./Validation";
import { ZipCodeValidator } from "./ZipCodeValidator";
import { LettersOnlyValidator } from "./LettersOnlyValidator";

// 一些测试样本
let strings = ["Hello", "98052", "101"];

// 要用到的验证器
let validators: { [s: string]: StringValidator; } = {};

validators["ZIP code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();

// 演示各个字符串是否通过各个验证器验证
strings.forEach(s => {
    for (let name in validators) {
        console.log(`"${ s }" - ${ validators[name].isAcceptable(s) ? "matches": "does not match" } ${ name }`);
    }
});
