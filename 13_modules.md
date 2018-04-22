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

编译完成时，每个模块都将成为一个单独的`.js`文件。对于那些引用标签，编译器将跟随`import`语句对依赖文件进行编译（As with reference tags, the compiler will follow `import` statements to compile dependent files）。

*Validation.ts*

```typescript
export interface StringValidator {
    isAcceptable (s: string): boolean;
}
```

*LettersOnlyValidator.ts*

```typescript
import { StringValidator } from "./Validation"

const lettersRegexp = /^[A-Za-z]+$/;

export class LettersOnlyValidator implements StringValidator {
    isAcceptable (s: string) {
        return lettersRegexp.test(s);
    }
}
```

*ZipCodeValidator.ts*

```typescript
import { StringValidator } from "./Validation";

const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
    isAcceptable (s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
```

*Test.ts*

```typescript
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
```

## 可选的模块加载与其它复杂加载场景（Optional Module Loading and Other Advanced Loading Scenarios）

在一些案例中，可能打算仅在部分情况下才装入某个模块（In some cases, you may want to only load a module under some condition）。TypeScript中可使用下面所给出的模式，实现这种或其它复杂加载场景，以在不损失类型安全的前提下，实现模块加载器的直接调用。

编译器对各个模块在生成的JavaScript中是否用到进行探测。如果某个模块识别符仅作为类型注记的部分被用到，而没有作为表达式用到，那么对那个模块就不会生成`require`调用（If a module identifier is only ever used as part of a type annotations and never as an expression, then no `require` call is emitted for that module）。这种对未使用引用的省略，是一种良好的性能优化，同时也允许这些模块的可选加载。

该模式的核心理念, 就是`import id = require("...")`语句给予了对该模块所暴露出的类型的访问（The core idea of the pattern is that the `import id = require("...")` statement gives us access to the types exposed by the module）。如下面所给出的`if`块一样，该模块加载器是动态触发的（通过`require`）。此特性利用了引用省略优化（the reference-elision optimization），因此仅在需要该模块时才进行加载。此模式要生效，就在于通过`import`所定义的符号，在类型位置处用到（即是，绝不能在将会生成到JavaScript中的位置用到）。

可使用`typeof`关键字，来维护类型安全。在某个类型位置出使用`typeof`关键字时，将产生某个值的类型，在该模式的情况下，就是模块的类型。

*Node.js 中的动态模块加载*

```typescript
declare function require(moduleName: string): any;

import { ZipCodeValidator as Zip } from "./ZipCodeValidator";

if ( needZipValidation ) {
    let ZipCodeValidator: typeof Zip = require("./ZipCodeValidator");
    let validator = new ZipCodeValidator();
    if (validator.isAcceptable("...")) { /* ... */ }
}
```

*示例： require.js中的动态模块加载*

```typescript
declare function require(moduleName: string[], onLoad: (...args: any[]) => void): void;

import * as Zip from "./ZipCodeValidator";

if (needZipValidation) {
    require(["./ZipCodeValidator"], (ZipCodeValidator: typeof Zip) => {
        let validator = new ZipCodeValidator.ZipCodeValidator();
        if (validator.isAcceptable("...")) { /* ... */ }
    });
}
```

## 与别的JavaScript库打交道（Working with Other JavaScript Libraries）

需要对库所暴露出的API进行声明，以描述那些不是用TypeScript编写的库的形状（To describe the shape of libraries not written in Typescript, we need to declare the API that the library exposes）。

对于那些并未定义某种实现的声明，将其成为“外围”（We call delarations that don't define an implementation "ambient"）。这些声明通常都是在`.d.ts`文件中定义的。如属性C/C++语言，那么这些文件可被看作是`.h`文件。来看看下面这些示例。

### 外围模块（Ambient Modules）

Node.js中的大多数任务，都是通过加载一个或多个模块完成的。尽管可将各个模块定义在其自己的、带有顶层导出声明的`.d.ts`文件中，不过将这些模块作为一个较大的`.d.ts`文件进行编写，则会更方便。做法就是使用一个类似与外围命名空间的结构，实际上使用`module`关键字，与在随后的导入中可以使用的模块引用名称（To do so, we use a construct similar to ambient namespaces, but we use the `module` keyword and the quoted name of the module which will be available to a later import）。比如：

*node.d.ts (简化摘要)*

```typescript
declare module "url" {
    export interface Url {
        protocol?: string;
        hostname?: string;
        pathname?: string;
    }

    export function parse(urlStr: string, parseQueryString?, slashesDenoteHost?): Url;
}

declare module "path" {
    export function nomarlize(p: string): string;
    export function join(...paths: any[]): string;
    export var sep: string;
}
```

现在就可以 `/// <reference> node.d.ts` 并使用`import url = require("url");` 或 `import * as URL from "url"`来装入模块了。

```typescript
/// <reference path="node.d.ts"/>

import * as URL from "url";
let myUrl = URL.parse("http://www.typescriptlang.org");
```

### 速记式外围模块（Shorthand ambient modules）

在不打算于使用某个新模块之前花时间编写其声明时，就可使用速记式声明特性（a shorthand declaration），以快速开工（If you don't want to take the time to write out declarations before using a new module, you can use a shorthand declaration to get started quickly）。

*declarations.d.ts*

```typescript
declare module "hot-new-module";
```

来自速记模块的所有导入，都将具有`any`类型。

```typescript
import x, {y} from "hot-new-module";
x(y);
```

### 通配符式模块声明（Wildcard module declarations）

一些诸如`SystemJS`及`AMD`的模块加载器允许导入非JavaScript内容（Some module loaders such as SystemJS and AMD allow non-JavaScript content to be imported）。这些模块加载器通常使用前缀或后缀（a prefix or suffix）来表明特殊加载的语义。通配符式模块声明就可用来满足这些情况。

```typescript
declare module "*!text" {
    const content: string;
    export default content;
}

// 反过来的做法
declare module "json!*" {
    const value: any;
    export default value;
}
```

现在就可以导入与`"*!text"`或`json!*`匹配的模块了。

```typescript
import fileContent from "./xyz.txt!text";
import data from "json!http://example.com/data.json";

console.log(data, fileContent);
```

### UMD模块（UMD Modules）

一些库被设计为可在多种模块加载器中使用，或是不带有模块加载功能（它们采用全局变量）。这些就是所说的UMD模块。这类库的访问，是通过导入项或全局变量进行的。比如：

*math-lib.d.ts*

```typescript
export function isPrime (x: number): boolean;
export as namespace mathLib;
```

随后该库便可作为模块内的一个导入进行使用了：

```typescript
import { isPrime } from "math-lib";

isPrime(2);
mathLib.isPrime(2); // 错误：在模块内部不能使用全局定义
```

其也可以作为一个全局变量使用，但仅限于在脚本内部（脚本是不带有导入与导出的文件）。

```typescript
mathLib.isPrime(2);
```

## 模块如何组织的守则（Guidance for structuring modules）

***尽可能在顶层进行导入（Export as close to top-level as possible）***

模块消费者在使用导入的模块时，摩擦应尽可能少。加入过多层次的嵌套将导致低效，因此在打算如何组织模块上应深思熟虑（Consumers of your module should have as little friction as possible when using things that you export. Adding too many levels of nesting tends to be cumbersome, so think carefully about how you want to structure things）。

从模块导出命名空间，就是加入过多层数嵌套的一个示例。虽然命名空间有时有其用处，但在使用模块时它们也加入了一层额外的非直接因素。这种做法很快会变为用户的痛点，同时通常是不必要的。

导出类上的静态方法，有着类似问题 -- 类本身加入了一层嵌套。除非这么做提升表现力或有某种明确有用形式的意图，那么就考虑简单地导出一个辅助函数（a helper function）。

***如仅导出单个的`class` 或 `function`，那么请使用`export default`***

与`靠近顶层导出`一样，默认导出项的使用，也能减少模块消费者上的摩擦（Just as "exporting near the top-level" reduces friction on your module's consumers, so does introducing a default export）。在模块的主要目的是存放一个特定的导出时，就应考虑将其作为默认导出项进行导出。这样做令到导入与导入项的使用更为容易一些。比如：

*MyClass.ts*

```typescript
export default class SomeType {
    constructor () { ... }
}
```

*MyFunc.ts*

```typescript
export default function getThing() { return "thing"; }
```

*Consumer.ts*

```typescript
import t from "./MyClass";
import f from "./MyFunc";

let x = new t();
console.log(f());
```

对于模块消费者，这是可选的。它们可将类型命名为它们想要的任何名字（这里的`t`），并不需要任何过度过度点缀来找到对象（They can name your type whatever they want(`t` in this case) and don't have to do any excessive dotting to find your objects）。

***如要导出多个对象，那么将它们一起放在顶层***

*MyThings.ts*

```typescript
export class SomeType { /* ... */ }
export function someFunc () { /* ... */ }
```

相反，在导入时应注意以下规则：

***显式地列出所导入的名称（Explicitly list imported names）***

*Consumer.ts*

```typescript
import { SomeType, someFunc } from "./MyThings";

let x = new SomeType();
let y = someFunc();
```

***使用命名空间导入模式，来导入较多的对象（Use the namespace import pattern if you're importing a large number of things）***

*MyLargeModule.ts*

```typescript
export class Dog { ... }
export class Cat { ... }
export class Tree { ... }
export class Flower { ... }
```

*Consumer.ts*

```typescript
import * as myLargeModule from "./MyLargeModule.ts";
let x = new myLargeModule.Dog();
```

### 再导出以进行扩展（Re-export to extend）

通常需要在某个模块上进行功能扩展。一种常见的JS模式就是使用 *扩展* 来增加原始对象，这与JQuery的扩展原理类似。如同先前提到的，模块并不会像全局命名空间对象那样 *融合*。因此推荐的做法是 *不要* 改动原始对象，而是导出一个提供新功能的新实体（A common JS pattern is to augment the original object with *extensions*, similar to how JQuery extensions work. As we've mentioned before, modules do not *merge* like global namespace objects would. The recommended solution is to *not* mutate the original object, but rather export a new entity that provides the new functionality）。

考虑下面这个定义在模块`Calculator.ts`中简单的计算器实现。该模块还导出了一个通过传入输入字符串清单，并在最后写出结果的，用于对计算器进行功能测试的辅助函数。

*Calculator.ts*

```typescript
export class Calculator {
    private current = 0;
    private memory = 0;
    private operator: string;

    protected processDigit (digit: string, currentValue: number) {
        if (digit >= "0" && digit <= "9") {
            return currentValue * 10 + (digit.charCodeAt(0) - "0".charCodeAt(0));
        }
    }

    protected processOperator (operator: string) {
        if (["+", "-", "*", "/"].indexOf(operator) >= 0) {
            return operator;
        }
    }

    protected evaluateOperator (operator: string, left: number, right: number): number {
        switch (this.operator) {
            case "+": return left + right;
            case "-": return left - right;
            case "*": return left * right;
            case "/": return left / right;
        }
    }

    private evaluate () {
        if (this.operator) {
            this.memory = this.evaluateOperator(this.operator, this.memory, this.current);
        }
        else {
            this.memory = this.current;
        }
        this.current = 0;
    }

    public handelChar (char: string) {
        if (char === "=") {
            this.evaluate();
            return;
        }
        else {
            let value = this.processDigit(char, this.current);

            if (value !== undefined) {
                this.current = value;
                return;
            }
            else {
                let value = this.processOperator(char);

                if (value !== undefined) {
                    this.evaluate();
                    this.operator = value;
                    return;
                }
            }
        }

        throw new Error(`Unsupported input: '${char}'`);
    }

    public getResult() {
        return this.memory;
    }
}

export function test (c: Calculator, input: string) {
    for (let i = 0; i < input.length; i++){
        c.handelChar(input[i]);
    }

    console.log(`result of '${input}' is '${c.getResult()}'`);
}
```

下面是使用所暴露出来的`test`函数的一个计算器的简单测试。

*TestCalculator.ts*

```typescript
import { Calculator, test } from "./Calculator";

let c = new Calculator;
test(c, "1+2*33/11=");
```

接着将其扩展到加入对其它进制的支持，来创建`ProgrammerCalculator.ts`吧。

*ProgrammerCalculator.ts*

```typescript
import { Calculator } from "./Calculator";

class ProgrammerCalculator extends Calculator {
    static digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

    constructor (public base: number) {
        super();

        if (base <= 0 || base > ProgrammerCalculator.digits.length) {
            throw new Error("基数必须要在0到16的范围");
        }
    }

    protected processDigit(digit: string, currentValue: number) {
        if (Programmercalculator.digits.indexOf(digit) >= 0) {
            return currentValue * this.base + ProgrammerCalculator.digits.indexOf(digit);
        }
    }
}

// 将新的已扩展的计算器作为`Calculator`进行导出
export { ProgrammerCalculator as Calculator };

// 还要导出辅助函数
export { test } from "./Calculator";
```

新的`ProgrammerCalculator`模块导出了一个与原始的`Calculator`模块类似的API外形，但并没有对原始模块中的任何对象进行修改。下面是对`ProgrammerCalculator`类的测试：

*TestProgrammerCalculator.ts*

```typescript
import { Calculator, test } from "./ProgrammerCalculator";

let c = new Calculator(2);
test(c, "001+010=");
```

### 不要在模块中使用命名空间（Do not use namespaces in modules）

在初次迁移到基于模块的组织形式时，常见的倾向就是将导出项封装到一个额外的命名空间层中（When first moving to a module-based organization, a common tendency is to wrap exports in an additional layer of namespaces）。模块有着其自己的作用域，同时仅有导出的声明是从模块外部可见的。记住了这一点，就明白在使用模块时，命名空间所提供到的价值就是很有限的。

在组织方式前，对于将逻辑上有联系的对象与类型，在全局作用域中进行分组，命名空间是很好用的。比如在C#中，就能在`System.Collections`找到所有的集合类型。通过将类型组织到层次化的命名空间，就能为这些类型的用户提到到良好的“发现”体验。但是模块本身必然已经文件系统中有所呈现。必须通过路径与文件名来解析这些模块，因此已经有了一套可使用的逻辑组织方案。比如可有着一个包含了清单模块的`/collections/generic/`文件夹（On the organization front, namespaces are handy for grouping together logically-related objects and types in the global scope. For example, in C#, you're going to find all the collection types in `System.Collections`. By organizing our types into hierarchical namespaces, we provide a good "discovery" experience for users of those types. Modules, on the other hand, are already present in a file system, necessarily. We have to resolve them by path and filename, so there's a logical organization scheme for us to use. We can have a `/collections/generic` folder with a list module in it）。

命名空间特性要注意避免全局作用域下的命名冲突。比如可能存在`My.Application.Customer.AddForm`与`My.Application.Order.AddForm`两个有着同样名称而不在同一命名空间的类型。这在模块中却不成问题。在模块中，并没有要让两个对象使用相同名称的不明原因。而从消费侧来看，任何给定模块的消费者有自主选取它们用于引用该模块的名称的权力，因此偶发的命名冲突是不可能出现的（Namespaces are important to avoid naming collisions in the global scope. For example, you might have `My.Application.Customer.AddForm` and `My.Application.Order.AddForm` -- two types with the same name, but a different namespace. This, however, is not an issue with modules. Within a module, there's no plausible reason to have two objects with the same name. From the comsumption side, the consumer of any given modules gets to pick the name that they will use to refer to the modules, so accidental naming conflicts are impossible）。

> 关于模块与命名空间的更多讨论，请参考[命名空间与模块](15_namespaces_and_modules.md)小节。

## 避免事项（Red Flags）

所有下面列出的，都是模块组织中需要避免的。在文件中有下面之一时，对要两次检查没有试着将外部模块进行命名空间操作（All of the following are red flags for module structuring. Double-check that you're not trying to namespace your external modules if any of these apply to your files）。

+ 仅有一个顶层声明，且为`export namespace Foo { ... }`的文件（移除`Foo`并将所有内容进行提升，A file whose only top-level declaration is `export namespace Foo { ... }` (remove `Foo` and move everything 'up' level)）

+ 仅有单个的`export class`或`export function`的文件（请考虑使用`export default`）

+ 有着相同位处顶层的`export namespace Foo {`的多个文件（一定不要认为它们会结合到同一个`Foo`中去，Multiple files that have the same `export namespace Foo {` at top-level(don't think that these are going to combine into one `Foo`!)）
