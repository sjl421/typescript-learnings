# 命名空间

> **关于术语的一点说明**：在TypeScript 1.5中需要注意的是，其中的命名法发生了改变。为了与ECMAScript 2015的命名法保持一致，"内部模块"以及被命名为“命名空间”。“外部模块”已被简化为“模块”，（名以上`module X {`与现在所指的`namespace X{`是等价的。it's important to note that in TypeScript 1.5, the nomenclature has changed. "Internal modules" are now "namespace". "External modules" are now simply "modules", as to align with ECMAScript 2015's terminology, (namely that `module X {` is equivalent to the now-preferred `namespace X{`)）。

## 简介

本文指出了TypeScript中使用命名空间（也就是先前的“内部模块”）来组织代码的不同方法。正如在有关命名法的注释中所暗示的，现已使用“命名空间”来指代“内部模块”了。此外，在将`module`关键字用于声明某个内部模块时，都可以且应当使用`namespace`关键字。这样做可避免由相似命名的用词带来的负担，而令到新用户迷惑。

## 第一步（First Steps）

这里以一个将贯穿本章节的示例开始。因为可能要对用户在web页中表单上的输入，或对某个外部提供的数据文件的格式进行检查，前面在模块章节曾编写了一个小的简化字符串验证器合集。

**单个文件中的验证器**

```typescript
interface StringValidator {
    isAcceptable (s: string): boolean;
}

let lettersRegexp = /^[A-Za-z]+$/;
let numberRegexp = /^[0-9]+$/;

class LettersOnlyValidator implements StringValidator {
    isAcceptable (s: string) {
        return lettersRegexp.test(s);
    }
}

class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}

// 一些尝试样本
let strings = ["Hello", "98052", "101"];


// 要使用的验证器
let validators: { [s: string]: StringValidator; } = {};

validators["ZIP code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();


// 展示各个字符串是否通过各个验证器验证
for (let s of strings) {
    for (let name in validators) {
        let isMatch = validators[name].isAcceptable(s);
        console.log(`"${ s }" ${ isMatch ? "matches" : "does not match" } "${ name }".`);
    }
}
```

## 命名空间化（Namespacing）

随着更多验证器的加入，就将想有着某种组织方案，从而可对类型加以跟踪，并不必担心与其它对象的名称冲突。可将这些对象封装到命名空间，以取代将很多不同名称放到全局命名空间的落后方式（As we add more validators, we're going to want to have some kind of organization scheme so that we can keep track of our types and not worry about name collisions with other objects. Instead of putting lots of different names into the global namespace, let's wrap up our objects into a namespace）。

在本例中，将把所有验证器相关的实体，移入到一个叫做`Validation`的命名空间中。因为想要这里的接口与类对外部可见，所以要使用`export`来为它们建立索引。反过来，变量`lettersRegexp`与`numberRegexp`则是实现细节，因此它们会保持非导出状态，且对命名空间外部不可见。在该文件底部的测试代码中，在命名空间外部使用这些类型时，就需要对这些类型的名称进行修饰了，比如`Validation.LettersOnlyValidator`。

**已命名空间化的验证器**

```typescript
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
```

## 拆分到多个文件（Splitting Across Files）

随着应用日益增长，就有将代码拆分到多个文件的想法，目的是令代码易于维护。

### 多文件命名空间（Multi-file namespace）

下面将把上面的命名空间`Validation`，拆分到许多文件（Here, we'll split our `Validation` namespace across many files）。尽管这些文件是分立的，它们却都能贡献到同一命名空间，且可以像是定义在一处那样被消费。因为文件之间存在依赖，所以将添加 **参考标志**（reference tags），来告诉编译器文件之间的关系。此外，测试代码并没有改动。

*Validation.ts*

```typescript
namespace Validation {
    export interface StringValidator {
        isAcceptable (s: string): boolean;
    }
}
```

*LettersOnlyValidator.ts*

```typescript
/// <reference path="Validation.ts">
namespace Validation {
    const lettersRegexp = /^[A-Za-z]+$/;

    export class LettersOnlyValidator implements StringValidator {
        isAcceptable (s: string) {
            return lettersRegexp.test(s);
        }
    }
}
```

*ZipCodeValidator.ts*

```typescript
/// <reference path="Validation.ts">
namespace Validation {
    const numberRegexp = /^[0-9]+$/;

    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}
```

*Test.ts*

```typescript
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
```

在涉及到多个文件时，就需要确保所有已编译的代码得到加载。而确保所有已编译代码得到加载的方式，有两种。

第一种，可使用级联输出（concatenated output）。就是使用`--outFile`编译选项，来将所有输入文件，编译到一个单独的输出文件中。

```bash
tsc --outFile sample.js Test.ts
```

基于这些文件中所出现的参考标志，编译器将自动对输出文件进行排序。还可以对各个文件进行单独指定：

```bash
tsc --outFile sample.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.ts
```

第二种方式，就是各个文件的单独编译（这是默认的做法），从而为每个输入文件都生成一个JavaScript文件。在产生了多个JS文件后，就需要在网页上使用`<script>`标签，来将各个生成的文件以适当顺序进行加载，比如：

*MyTestPage.html（片段）*

```html
<script src="Validation.js" type="text/javascript" />
<script src="LettersOnlyValidarot.js" type="text/javascript" />
<script src="ZipCodeValidator.js" type="text/javascript" />
<script src="Test.js" type="text/javascript" />
```

## 别名（Alias）

另一种可简化命名空间使用的方式，就是使用`import q = x.y.z`，来为一些常用对象创建较短名称（Another way that you can simplify working with of namespaces is to use `import q = x.y.z` to create shorter names for commonly-used objects）。请将此种语法不要与用于加载模块的`import x = require("name")`语法搞混，此种语法只是简单地创建一个指定符号的别名。对于任何种类的标识符，包括模块导入项所建立的对象，都可以使用这类的导入（通常被称作别名，You can use these sorts of imports(commonly referred to as aliases) for any kind of identifier, including objects created from module imports）。

```typescript
namespace Shapes {
    export namespace Polygons {
        export class Triangle {}
        export class Square {}
    }
}

import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // 与 `new Shapes.Polygons.Square()` 效果一样
```

注意这里没有使用`require`关键字；而是直接从所导入的符号的合格名称进行赋值。这就与使用`var`关键字类似，但也在所导入的符号的类型与命名空间涵义上有效。重要的是，对于数值来说，`import`则相对于原始符号，是不同的引用，因此对别名化的`var`的修改，将不会反映到原始变量（instead we assign directly from the qualified name of the symbol we're importing. This is similar to using `var`, but also works on the type and namespace meanings of the imported symbol. Importantly, for values, `import` is a distinct reference from the original symbol, so changes to an aliased `var` will not be reflected in the original variable）。

## 与其它JavaScript库的交互（Working with Other JavaScript Libraries）

为对那些不是以TypeScript编写的库的外形进行描述，需要声明该库所暴露出的API。因为大多数的JavaScript库都仅会暴露少数几个的顶级对象，所以命名空间是一种对这些库进行表示的好方式（To describe the shape of libraries not written in TypeScript, we need to declare the API that the library exposes. Because most JavaScript libraries expose only a few top-level objects, namespaces are a good way to represent them）。

对于那些没有对实现进行定义的声明，这里将其成为“外围”声明。外围声明通常都是定义在`.d.ts`文件中的。如对C/C++较为熟悉，那么可将这些`.d.ts`文件，看作是`.h`文件。下面是一些示例。

### 外围命名空间（Ambient Namespaces）

流行库[D3](https://d3js.org/)就是在叫做`d3`的全局对象中定义其功能的。因为该库是通过`<script>`标签（而不是模块加载器）加载的，所以其声明使用了命名空间来定义其外形。要让TypeScript的编译器看到该外形，就要使用外围命名空间声明（an ambient namespace declaration）。比如，可像下面这样开始编写该外围命名空间声明：

*D3.d.ts (简化摘抄)*

```typescript
declare namespace D3 {
    export interface Selectors {
        select: {
            (selector: string): Selection;
            (element: EventTarget): Selection;
        }
    }

    export interface Event {
        x: number;
        y: number;
    }

    export interface Base extends Selectors {
        event: Event;
    }
}

declare var d3: D3.Base;
```


