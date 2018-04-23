namespace Validation {
    export interface StringValidator {
        isAcceptable (s: string): boolean;
    }

    const lettersRegexp = /^[A-Za-z]+$/;
    const numberRegexp = /^[0-9]+$/;

    export class LettersOnlyValidator implements StringValidator {
        isAcceptable (s: string) {
            return lettersRegexp.test(s);
        }
    }

    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}

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
