# 命名空间与模块

> **关于术语的一点说明**：在TypeScript 1.5中需要注意的是，其中的命名法发生了改变。为了与ECMAScript 2015的命名法保持一致，"内部模块"以及被命名为“命名空间”。“外部模块”已被简化为“模块”，（名以上`module X {`与现在所指的`namespace X{`是等价的。it's important to note that in TypeScript 1.5, the nomenclature has changed. "Internal modules" are now "namespace". "External modules" are now simply "modules", as to align with ECMAScript 2015's terminology, (namely that `module X {` is equivalent to the now-preferred `namespace X{`)）。

## 简介

本文对TypeScript中使用命名空间与模块进行代码组织的多种方式进行了说明。还将对如何使用命名空间与模块中的一些复杂问题进行分析，并就TypeScript中它们的使用上的一些常见陷阱，进行排除。

关于模块与命名空间的更多信息，请分别参阅[模块](13_moduels.md)与[命名空间](14_namespaces.md)章节。

## 使用命名空间（Using Namespaces）

简单来说，命名空间就是全局命名空间中的一些命名的JavaScript对象。这就令到命名空间成其为一种可用的、非常简单的解构（Namespaces are simply named JavaScript objects in the global namespace. This makes namespaces a very simple construct to use）。它们可以跨越多个文件，并可通过使用`--outFile`编译选项进行级联。对于Web应用中代码的结构化，就是将所有依赖都作为HTML页面中`<script>`标签进行包含来说，命名空间可作为一个良好方法。

与所有全局命名空间污染一样，命名空间的使用仍有着难于识别组件依赖的问题，尤其实在大型应用中。

## 使用模块（Using Modules）

与命名空间一样，模块也可包含代码与声明。主要的不同就是模块 *声明* 了它们的依赖。

模块同样有着模块加载器的依赖（比如CommonJS/Require.js，Modules also have a dependency on a module loader(such as CommonJS/Require.js)）。对于小型JS应用，这可能不是最优的，但对于较大型应用，却可受益于长期的模块化与可维护性所带来的开销。模块提供了更佳的代码重用、更强的隔离与更好的捆绑工具支持（Modules provide for better code reuse, stronger isolation and better tooling support for bundling）。

值得指出的是，对于Node.js应用，模块是组织代码的默认及推荐方法。

从ECMAScript 2015开始，模块已经是该语言的原生部分，同时应被所有兼容殷勤实现所支持。因此，模块应作为新项目的推荐代码组织机制。

## 命名空间与模块的一些陷阱（Pitfalls of Namespaces and Modules）

本小节将对在使用命名空间与模块中的一些常见陷阱，以及如何避免它们进行描述。

### `/// <reference>-ing a moudle` （使用`///` 语法对模块的引用）

一个常见错误，就是尝试使用`/// <reference ... />`语法，而不是使用`import`语句，来对模块文件进行引用。为对这两种语法进行区分，首先需要搞清楚编译器是如何根据某个`import`的路径（比如`import x from "...";`中的`...`），来定位某个模块的类型信息的。

编译器将尝试在应用路径下找到一个`.ts`、`.tsx`及随后的`.d.ts`文件。如找不到特定文件，那么编译器将查找某个 *外围模块声明*（an *ambient module declaration*）。回顾一下就知道这些（外围模块声明）需在某个`.d.ts`文件中进行定义。

+ `myModule.d.ts`

    ```typescript
    // 应在某个`.d.ts`文件，或一个非模块的`.ts`文件中
    declare module "SomeModule" {
        export function fn(): string;
    }
    ```

+ `myOtherModule.ts`

    ```typescript
    /// <reference path="myModule.d.ts" />
    import * as m from "SomeModule";
    ```

这里用到的引用标签，允许对包含了外围模块声明的声明文件进行定位。这就是多个TypeScript示例所使用的`node.d.ts`被消费的方式（The reference tag here allows us to locate the declaration file that contains the declaration for the ambient module. This is how the `node.d.ts` file that several of the TypeScript samples use is consumed）。

### 不必要的命名空间化（Needless Namespacing）

如正将某个程序从命名空间式转换为模块式，就很容易得到一个像是下面的程序：

+ `shapes.ts`

    ```typescript
    export namespace Shapes {
        export class Triangle { /* ... */ }
        export class Square { /* ... */ }
    }
    ```

这里的顶层模块`Shapes`毫无理由的封装了`Triange`与`Square`。这样做对于模块消费者来说，是令人困惑与烦人的。

+ `shapeConsumer.ts`

    ```typescript
    import * as shapes from "./shapes";

    let t = new shapes.Shapes.Triangle(); // shapes.Shapes, 真的吗？
    ```

TypeScript中模块的关键特性，就是连个不同的模块，绝不会将其名称放在同一作用域中。因为是由模块的消费者来决定将什么药的名称指派模块，所以不需要主动地将所导出的符号，封装到某个命名空间中（A key feature of modules in TypeScript is that two different modules will never contribute names to the same scope. Because the consumer of a module decides what name to assign it, there's no need to proactively wrap up the exported symbols in a namespace）。

为对为何不应对模块内容进行命名空间化操作进行重申，要知道命名空间化的一般构思，就是为了提供结构体的逻辑分组，以及防止名称上的冲突。因为模块文件本身就已经是逻辑分组的了，同时其顶层名称也已经通过其导入代码进行了定义，因此为已导出对象而使用一个额外模块层就是不必要的了。

下面是一个修订后的示例：

+ `shapes.ts`

    ```typescript
    export class Triangle { /* ... */ }
    export class Square { /* ... */ }
    ```

+ `shapeConsumer.ts`

    ```typescript
    import * as shapes from "./shapes";
    let t = new shapes.Triangle();
    ```

## 模块的权衡（Trade-offs of Modules）

JS文件与模块之间有着一一对应关系，与之一样，TypeScript在模块源文件和它们所生成的文件之间，也有着一一对应关系。这一特征的一个影响就是，无法将多个依据目标模块系统的模块源文件级联起来（One effect of this is that it's not possible to concatenate multiple source files depending on the module system you target）。比如就在目标模块系统为`commonjs`或`umd`时，无法使用`--outFile`编译选项，但在TypeScript 1.8之后的版本中，在以`amd`或`system`为目标模块系统时，使用`--outFile`选项是可能的。
