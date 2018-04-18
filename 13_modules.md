# 模块

**Modules**

> **关于术语的一点说明**：在TypeScript 1.5中需要注意的是，其中的命名法发生了改变。为了与ECMAScript 2015的命名法保持一致，"内部模块"以及被命名为“命名空间”。“外部模块”已被简化为“模块”，（名以上`module X {`与现在所指的`namespace X{`是等价的。it's important to note that in TypeScript 1.5, the nomenclature has changed. "Internal modules" are now "namespace". "External modules" are now simply "modules", as to align with ECMAScript 2015's terminology, (namely that `module X {` is equivalent to the now-preferred `namespace X{`)）。

## 简介

从ECMAScript 2015开始，JavaScript就有了模块的概念。TypeScript采纳了此概念。

模块在它们自己的作用域，而非全局作用域中执行（Modules are executed within their own scope, not in the global scope）; 这就意味着在模块中所声明的变量、函数、类等等，除非在使用某种[`export`形式](#export)被显式地对其进行了导出，否则它们在模块外面是不可见的。反过来，要消费从另一个模块中导出的变量、函数、类、接口等，就必须要使用某种[`import`形式](#import)将其导入。

模块是声明式的；模块间的关系，实在文件级别，以导入及导出进行指定的（Modules are declarative; the relationships between modules are specified in terms of imports and exports at the file level）。

使用模块加载器，可在模块中导入其它模块。运行时的模块加载器，负责在执行某个模块前，定位并执行其所有依赖。在JavaScript中，熟知的模块加载器有Node.js的[CommonJS](https://en.wikipedia.org/wiki/CommonJS)模块加载器，及Web应用的[require.js](http://requirejs.org/)加载器。

在TypeScript中，就如同ECMAScript 2015中一样，任何包含了顶级`import`与`export`的文件，都被看作是一个模块（In TypeScript, just as in ECMAScript 2015, any file containing a top-level `import` and `export` is considered a module）。相反，不带有顶级`import`或`export`声明的文件，则被作为脚本对待，其内容是全局作用域可用的（因此对模块也可用）。

## 导出

### 导出某个声明

任何声明（诸如变量、函数、类型、类型别名或接口等）都可以通过加上`export`关键字，加以导出。

*Validation.ts*

```typescript
export interface StringValidator {
    isAcceptable(s: string): boolean;
}
```

*ZipCodeValidator.ts*

```typescript
export const numberRange = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
```

### 导出语句

在需要为消费者而将导出项重命名时，导出语句就很好用，因此上面的示例可写成这样：

```typescript
class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}

export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };
```

### 再度导出（Re-exports）

通常模块会对其它模块进行扩展，并部分地暴露出一些它们的特性。那么再度导出就不会在本地导入，或是引入一个本地变量（A re-export does not import it locally, or introduce a local variable）。

*ParseIntBasedZipCodeValidator.ts*

```typescript
export class ParseIntBasedZipCodeValidator {
    isAcceptable (s: string) {
        return s.length === 5 && parseInt(s).toString() === s;
    }
}

// 在重命名原始的验证器后导出
export { ZipCodeValidator as RegExpBasedZipCodeValidator } from "./ZipCodeValidator";
```

作为可选项，一个模块可封装一个或多个模块，并通过使用`export * from "module"`，而将所有它们的导出项结合起来。

*AllValidators.ts*

```typescript
export * from "./StringValidator"; // 导出接口 `StringValidator`
export * from "./LettersOnlyValidator"; // 导出类 `LettersOnlyValidator`
export * from "./ZipCodeValidator"; // 导出类`ZipCodeValidator`
```

## 导入

导入就跟从模块导出一样容易。通过下面这些`import`形式，就可完成已导出声明的导入：

### 从某个模块中导入单一的导出项

```typescript
import { ZipCodeValidator } from "./ZipCodeValidator";

let myValidator = new ZipCodeValidator();
```

导入项也可以被重命名

```typescript
import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";

let myValidator = new ZCV();
```

### 将整个模块导入到单个变量中，并使用该变量来访问该模块的导出项

```typescript
import * as validator from "./ZipCodeValidator";

let myValidator = new validator.ZipCodeValidator();
```

### 仅以副作用目的导入模块（Import a module for side-effects only）

尽管此种方式不是推荐的做法，但某些模块设置了一些可被其它模块使用的全局状态。这些模块可以没有导出项，或者消费者并不对其导出项感兴趣。要导入这些模块，就用下面的形式：

```typescript
import "./my-module.js"
```

## 默认导出项（Default exports）

每个模块可选择导出一个`default`导出项。默认导出项是以关键字`default`进行标记的；同时每个模块只能有一个`default`导出项。`default`导出项的导入，使用的是一种有别的形式。

`default`导出项用起来很顺手。比如，诸如Jquery这样的库，就可以有一个`jQuery`或`$`的默认导出项，当然也要以名称`$`或`jQuery`对其进行导入。

*JQuery.d.ts*

```typescript
declare let $: JQuery;
export default $;
```

*App.ts*

```typescript
import $ from "JQuery";

$("button.continue").html( "Next Step..." );
```

类与函数的声明，可直接作为默认导出项进行编写。默认导出的类与函数声明名称是可选的（Default export class and function declaration names are optional）。

*ZipCodeValidator.ts*

```typescript
export default class ZipCodeValidator {
    static numberRegexp = /^[0-9]+$/;

    isAcceptable (s: string) {
        return s.length === 5 && ZipCodeValidator.numberRegexp.test(s);
    }
}
```

*Test.ts*

```typescript
import validator from "./ZipCodeValidator";

let myValidator = new validator();
```

或者

*StaticZipCodeValidator.ts*

```typescript
const numberRegexp = /^[0-9]+$/;

export default function (s: string) {
    return s.length === 5 && numberRegexp.test(s);
}
```

*Test.ts*

```typescript
import validator from "./StaticZipCodeValidator";

let strings = ["Hello", "98052", "101"];

// 使用函数验证
strings.forEach(s => {
    console.log("${s}" ${validate(s)}) ? " matches ": " does not match ";
});
```

`default`导出项还可以只是值：

*OneTwoThree.ts*

```typescript
export default "123";
```

*Log.ts*

```typescript
import num from "./OneTwoThree";

console.log(num); // "123"
```

## `export =`与`import = require()`

CommonJS与AMD（Asynchronous Module Definition API，异步模块定义接口）都具有`exports`对象这个概念，该对象包含了来自某个模块的所有导出项。

它们也支持以一个定制单一对象，来替换`exports`。默认导出项就是为了作为进行此做法的一个替代；但二者并不兼容。TypeScript支持`export =`特性，以对传统的CommonJS与AMD工作流进行模仿（They also support replacing the `exports` object with a custom single object. Default exports are meant to act as a replacement for this behavior; however, the two are incompatible. TypeScript supports `export =` to model the traditional CommonJS and AMD workflow）。

`export =`语法指定出从模块导出的单个对象。其可以是类、接口、命名空间、函数或枚举等（The `export =` syntx specifies a single object that is exported from the module. This can be a class, interface, namespace, funciton, or enum）。

在使用`export =`来导出某个模块时，必须使用特定于TypeScript的`import module = require("module")`，来导入该模块。

*ZipCodeValidator.ts*

```typescript
let numberRegexp = /^[0-9]+$/;

class ZipCodeValidator {
    isAcceptable (s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}

export = ZipCodeValidator;
```

*Test.ts*

```typescript
import zip = require("./ZipCodeValidator");

// 一些要尝试的示例
let strings = ["hello", "98052", "101"];

// 要使用的验证器
let validator = new zip();

// 给出各个字符串是否通过各个验证器检查
strings.forEach(s => {
    console.log("${s}" - ${ validator.isAcceptable(s) ? " matches" : "does not match"});
});
```

## 模块的代码生成

根据编译期间特定的目标模块，编译器将生成针对Node.js（CommonJS）、require.js（AMD）、[UMD](https://github.com/umdjs/umd)（Universal Module Definition API，通用模块定义接口）、[SystemJS](https://github.com/systemjs/systemjs)（启用在浏览器及NodeJS中动态ES模块工作流的，可配值模块加载器），或[ECMAScript 2015原生模块](http://www.ecma-international.org/ecma-262/6.0/#sec-modules)（ES6）的模块加载系统。可参考上述各个模块加载器文档，来进一步了解有关生成代码中`define`、`require`与`register`调用有什么作用。

下面的简单示例，演示了在导入与导出期间所用到的名称，是如何被翻译到模块加载代码中去的。

*SimpleModule.ts*

```typescript
import m = require("mod");
export let t = m.something + 1;
```

*AMD/RequireJS 的 SimpleModule.js*

```javascript
define(["require", "exports", "./mod"], function(require, exports, mod_1) {
    exports.t = mod_1.something + 1;
});
```

*CommonJS/Node 的 SimpleModule.js*

```javascript
var mod_1 = require("./mod");
exports.t = mod_1。something + 1;
```

*UMD de SimpleModule.js*

```javascript
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);

        if (v !== undefined) {
            module.exports = v;
        }
    }
    else if (typeof define === "function" && define.amd){
        define(["require", "exports", "./mod"], factory);
    }
})(function(require, exports) {
    var mod_1 = require("./mod");
    exports.t = mod_1.something + 1;
});
```

*SystemJS 的 SimpleModule.js*

```javascript
System.register(["./mod"], function(exports_1) {
    var mod_1;
    var t;
    return {
        setters: [
            function (mod_1_1) {
                mod_1 = mod_1_1;
            }],
        execute: function () {
            exports_1("t", t = mod_1.something + 1);
        }
    }
});
```

*原生ECMAScript 2015模块式的 SimpleModule.js*

```javascript
import { something } from "./mod"
export var t = something + 1;
```

## 简单示例

接下来将对先前示例中用到的验证器实现，综合为仅从各个模块导出单个的命名导出项（Below, we've consolidated the Validator implementations used in previous examples to only export a single named export from each module）。

必须要在命令行指定模块编译的目标。对于Node.js，使用`--module commonjs`；对于require.js，使用`--module amd`。比如：

```bash
tsc --module commonjs Test.ts
```


