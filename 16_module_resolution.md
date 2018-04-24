# 模块解析

**Module Resolution**

> 本章节假定已对模块的一些基本知识有所掌握。请参阅[模块](13_modules.md)了解更多信息。

*模块解析* 是编译器用于弄清导入项引用的是什么的过程（ *Module resolution* is the process the compiler uses to figure out what an import refers to）。请想想`import { a } from "moduleA"`这样的导入语句；为了对`a`的所有使用进行检查，编译器就需要准确地知道其代表的是什么，且将对其定义`moduleA`进行检查。

此刻，编译器就会询问“`moduleA`的外形是什么？”，尽管这听起来很直截，`moduleA`则可能是定义在某个`.ts/.tsx`文件中，或这在代码所依赖的某个`.d.ts`文件中。

首先，编译器将尝试找到代表所导入模块的文件。编译器依据两种不同策略之一完成这一步：经典方式或节点方式（First, the compiler will try to locate a file that represents the imported module. To do so the compiler follows one of two different strategies: Classic or Node）。这两种策略告诉编译器去 *哪里* 查找`moduleA`。

如两种策略都不奏效且模块名称是非相对的（在`moduleA`这种情况下，模块名称就是相对的），那么编译器将尝试定位一个外围模块声明（ambient module declaration）。接下来会对非相对导入项进行讨论。

最后，在编译器无法对模块进行解析是，就会记录一个错误。在这种情况下，错误将为像是`error TS2307: Cannot find module 'moduleA'.`这样的。

### 相对与非相对模块导入项（Relative vs. Non-relative module imports）

根据模块引用为相对或非相对的不同，模块导入项的解析会有所不同（Module imports are resolved differently based on whether the module reference is relative or Non-relative）。


*相对导入项* 就是以 `/`、`./`或`../`开头的导入项。下面是一些示例：

+ `import Entry from "./components/Entry";`

+ `import { DefaultHeaders } from "../constants/http";`

+ `import "/mod";`

除此之外所有其它导入都被认为是 **非相对** 的。下面是一些示例：

+ `import * as $ from "jquery";`

+ `import { Component } from "@angular/core";`

相对导入项被解析为相对于导入文件，并 *无法* 解析为外围模块声明。对于自己的可在运行时保证其相对位置维护的模块，可使用相对导入项（ You should use relative imports for your own modules that are guaranteed to maintain their relative location at runtime）。

非相对导入则可被解析为相对于`baseUrl`，或通过下面将讲到的路径映射（A non-relative import can be resolved relative to `baseUrl`, or through path mapping, which we'll cover below）。非相对导入项也可解析到外围模块声明。在导入所有外部依赖时，都要使用非相对路径（Use non-relative paths when importing any of your external dependencies）。

### 模块解析策略（Module Resolution Strategies）

模块解析策略有两种：节点策略与经典策略。可使用`--moduleResoluton`选项来指定模块解析策略。在没有指定时，对于`--module AMD | System | ES2015`的默认策略是经典策略，对其它模块，默认策略是节点策略。

### 经典策略（Classic）

该模块解析策略曾是TypeScript的默认解析策略。如今，该策略主要是为向后兼容性而保留。

相对导入项将被解析为相对于导入文件。因此源文件`/root/src/folder/A.ts`中的`import { b } from "./moduleB"`将导致以下查找：

1. `/root/src/folder/moduleB.ts`

2. `/root/src/folder/moduleB.d.ts`

而对于非相对导入项，编译器就唤醒以包含导入文件开始的目录树，尝试定位匹配的定义文件。

比如：

在源文件`/root/src/folder/A.ts`中到`moduleB`的一个非相对导入项，比如`import { b } from "moduleB"`，将导致尝试在下面的位置，对`moduleB`进行定位：

1. `/root/src/folder/moduleB.ts`

2. `/root/src/folder/moduleB.d.ts`

3. `/root/src/moduleB.ts`

4. `/root/src/moduleB.d.ts`

5. `/root/moduleB.ts`

6. `/root/moduleB.d.ts`

7. `/root/moduleB.ts`

8. `/root/moduleB.d.ts`


### 节点策略（Node）

此解析策略尝试在运行时对`Node.js`的模块解析机制进行模仿（This resolution strategy attempts to mimic the Node.js module resolution mechanism at runtime）。完整的Node.js解析算法在[Node.js模块文档](https://nodejs.org/api/modules.html#modules_all_together)中有说明。

*Node.js是如何解析模块的*

要理解TypeScript所跟随的脚步，就要对Node.js模块有进一步了解。

传统上，Node.js中的导入是通过调用一个名为`require`的函数完成的。根据给予`require`函数的是一个相对路径或绝对路径，Node.js所采取的做法会有所不同。

相对路径就相当直接。比如，考虑一个包含了`var x = require("./moduleB");`，位于`/root/src/moduleA.js`的文件，Node.js就会按照以下顺序对那个导入进行解析：

1. 如存在名为`/root/src/moduleB.js`的文件，就询问该文件。

2. 如文件夹`/root/src/moduleB`包含了名为`package.json`、指定了一个`"main"`模块的文件，那么就对该文件夹进行询问。在这个示例中，如Node.js发现文件`/root/src/moduleB/package.json`中包含`{ "main": "lib/mainModule.js" }`，那么Node.js将引用到`/root/src/moduleB/lib/mainModule.js`。

3. 询问文件夹`/root/src/moduleB`是否包含一个名为`index.js`的文件。那个文件被显式地认为是那个文件夹的`main`模块。

有关此方面的内容，可参考Node.js的文档中[文件模块](https://nodejs.org/api/modules.html#modules_file_modules)与[文件夹模块](https://nodejs.org/api/modules.html#modules_folders_as_modules)的内容。

但对[非相对模块名称](https://www.typescriptlang.org/docs/handbook/module-resolution.html#relative-vs-non-relative-module-imports)的解析，则是不同的。Node.js将在名为`node_modules`的特殊文件夹中查找。`node_modules`文件夹可以与当前文件在同一级别，或在目录链中的更高级别。Node.js将唤醒该目录链，将各个`node_modules`找个遍，直到找到尝试载入的模块为止。

接着上面的示例，试想在`/root/src/moduleA.js`使用了非相对路径并有着`var x = require("moduleB");`。那么Node就会尝试将`moduleB`解析到下面这些位置，知道某个位置工作。

1. `/root/src/node_modules/moduleB.js`

2. `/root/src/node_modules/moduleB/package.json` （在该文件指明了一个`main`属性时）

3. `/root/src/node_modules/moduleB/index.js`



4. `/root/node_modules/moduleB.js`

5. `/root/node_modules/moduleB/package.json`  （在该文件指明了一个`main`属性时） 

6. `/root/node_modules/moduleB/index.js`




7. `/node_modules/moduleB.js`

8. `/node_modules/moduleB/package.json`  （在该文件指明了一个`main`属性时）

9. `/node_modules/moduleB/index.js`


请注意在第4及7步Node.js都往上跳了一个目录。

可从Node.js文档中有关[从`node_modules`加载模块](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders)部分，了解更多此过程的信息。

## TypeScript解析模块的方式（How TypeScript resolves modules）

为了在编译时对模块的定义文件进行定位，TypeScript将模仿Node.js的运行时解析策略（the Node.js run-time resolution strategy）。为达到此目的，TypeScript以TypeScript源文件扩展名（`.ts`、`.tsx`及`.d.ts`）来覆盖Node的解析逻辑。TypeScript也将使用`package.json`中的一个名为`"types"`的字段，来反映Node.js中`"main"`的目的 -- 编译器将使用`"types"`字段来找到需要参考的“main”定义文件（To accomplish this, TypeScript overlays the TypeScript source file extensions(`.ts`, `.tsx`, and `.d.ts`) over the Node's resolution logic. TypeScript will also use a field in `package.json` names `"types"` to mirror the purpose of `"main"` -- the compiler will use it to find the "main" definition file to consult）。


比如，一个`/root/src/moduleA.ts`中像`import { b } from "./moduleB";`的导入语句，将导致编译器尝试在一下位置对`"./moduleB"`进行定位：

1. `/root/src/moduleB.ts`

2. `/root/src/moduleB.tsx`

3. `/root/src/moduleB.d.ts`

4. `/root/src/moduleB/package.json` （如`package.json`中指明了`types`属性）

5. `/root/src/moduleB/index.ts`

6. `/root/src/moduleB/index.tsx`

7. `/root/src/moduleB/index.d.ts`


回想上面，Node.js就是先查找名为`moduleB.js`的文件，再查找一个应用的`package.json`，随后再查找一个`index.js`的。

与此类似，对于非相对导入项，也会依循Node.js的解析逻辑，首先查找文件，再查找应用文件夹（an application folder）。因此源文件`/root/src/moduleA.ts`中的`import { b } from "moduleB";`将导致下面的查找：

1. `/root/src/node_modules/moduleB.ts`

2. `/root/src/node_modules/moduleB.tsx`

3. `/root/src/node_modules/moduleB.d.ts`


4. `/root/src/node_modules/moduleB/package.json` （在其指明了`types`属性时）

5. `/root/src/node_modules/moduleB/index.ts`

6. `/root/src/node_modules/moduleB/index.tsx`

7. `/root/src/node_modules/moduleB/index.d.ts`


8. `/root/node_modules/moduleB.ts`

9. `/root/node_modules/moduleB.tsx`

10. `/root/node_modules/moduleB.d.ts`


11. `/root/node_modules/moduleB/package.json`  （在其指明了`types`属性时）

12. `/root/node_modules/moduleB/index.ts`

13. `/root/node_modules/moduleB/index.tsx`

14. `/root/node_modules/moduleB/index.d.ts`


15. `/node_modules/moduleB.ts`

16. `/node_modules/moduleB.tsx`

17. `/node_modules/moduleB.d.ts`



18. `/node_modules/moduleB/package.json`  （在其指明了`types`属性时）

19. `/node_modules/moduleB/index.ts`

20. `/node_modules/moduleB/index.tsx`

21. `/node_modules/moduleB/index.d.ts`


不要被这里的步数吓到 -- TypeScript仍只是在第8和15步处两次网上跳了一个目录而已。这与Node.js所做的，也并没有更复杂。

### 额外的模块解析开关（Additional module resolution flags）

在有的时候，项目源代码布局并不与输出所匹配。通常有一套的构建步骤，来生成最终结果（A project source layout sometimes does not match that of the output. Usually a set of build steps result in generating the final output）。这些步骤包括将`.ts`文件编译为`.js`文件，以及将不同源代码位置的依赖，拷贝到单个的输出位置。最终结果就是运行时的模块，可能有着与包含这些模块定义的源文件所不同的名称。或者最后输出中的模块路径，可能与编译时这些模块所对应的源文件路径不一致。

TypeScript编译器有着一套额外选项，以 *告知* 编译器为了生成最终输出，而期望对源程序进行的一些调整（The TypeScript compiler has a set of additional flags to *inform* the compiler of transformations that expected to happen to the sources to generate the final output）。

比如`baseUrl`的设置，就可告诉编译器在何处去找到模块。所有非相对名称的模块导入项，都被假定相对于`baseUrl`。

*baseUrl*的值，取决于以下两个因素：

+ `baseUrl`值的命令行参数（如给出的路径为相对路径，那么`baseUrl`的值就根据当前路径计算得出）

+ 'tsconfig.json'中`baseUrl`属性的值（如果该属性值为相对的，那么`baseUrl`的值就根据'tsconfg.json'的位置计算得出）

注意相对模块导入项是不受baseUrl设置的影响的，因为因为相对模块导入项，总是被解析到相对于它们的导入文件。

有关baseUrl的更多信息，请参考[RequireJS](http://requirejs.org/docs/api.html#config-baseUrl)及[SystemJS](https://github.com/systemjs/systemjs/blob/master/docs/config-api.md#baseurl)的文档。

### 路径映射（Path mapping）

模块有的时候并不是直接位于 *baseUrl* 下。比如，到模块`jquery`的导入项，就会在运行时被翻译到`node_modules/jquery/dist/jquery.slim.min.js`。加载器使用映射配置（a mapping configuration），以在运行时将模块名称映射到文件，请参阅[RequireJS 文档](http://requirejs.org/docs/api.html#config-paths)与[SystemJS 文档](https://github.com/systemjs/systemjs/blob/master/docs/config-api.md#paths)。

TypeScript编译器通过在`tsconfig.json`文件中使用`paths`属性，来支持此类映射的声明（The TypeScript compiler supports the declaration of such mappings using `paths` in `tsconfig.json` files）。下面是一个如何为`jquery`指定`paths`属性的示例：

```json
{
    "compilerOptions": {
        "baseUrl": ".", // 如指定了"paths", 那么就必须指定"baseUrl"
        "paths": {
            "jquery": ["node_modules/jquery/dist/jquery"] // 该映射是相对于baseUrl的
        }
    }
}
```

请注意`"paths"`是被解析到相对于`"baseUrl"`的。在将`"baseUrl"`设置为非`"."`时，比如`tsconfig.json`的目录时，映射也必须进行相应修改。也就是说，在将上面的示例设置为`"baseUrl": "./src"`后，jquery就应被映射到`"../node_modules/jquery/dist/jquery"`。

`"paths"`的使用，可实现包括设置多个错误回退位置特性等的较复杂映射机制（Using `"paths"` also allows for more sophisticated mappings including multiple fall back locations）。设想某个项目的配置中，在一个位置仅有部分模块是可用的，其余则是在另一处的情形。构建步骤就会将这些不同位置的模块放在一个地方。该项目布局看起来像这样：

```bash
projectRoot
├── folder1
│   ├── file1.ts (imports 'folder1/file2' and 'folder2/file3')
│   └── file2.ts
├── generated
│   ├── folder1
│   └── folder2
│       └── file3.ts
└── tsconfig.json
```

那么相应的`tsconfig.json`就应像这样了：

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "*": [
                "*",
                "generated/*"
            ]
        }
    }
}
```

这样做就告诉编译器，对于所有与模式`"*"`（也就是所有值）匹配的模块导入项，要在两个地方进行查找：

1. `"*"`： 意指未改变的同一名称，因此映射为`<moduleName> => <baseUrl>/<moduleName>`

2. `"generated/*"` 意指带有追加了前缀"generated"的模块名称，因此映射为 `<moduleName> => <baseUrl>/generated/<moduleName>`

那么按照此逻辑，编译器将如下对这两个导入项进行解析：

+ 对于导入项'folder1/file2':

    1. 匹配了模式`'*'`，同时通配符捕获到整个名称

    2. 尝试清单中的第一个代换（substitution）：`'*'`, 从而得到 `folder1/file2`

    3. 代换结果为非相对名称 -- 将其与 *baseUrl* 结合，得到 `projectRoot/folder1/file2.ts`

    4. 该文件存在。解析成功。

+ 对于导入项'folder2/file3'
    
    1. 匹配了模式`"*"`，且通配符捕获到整个模块名称

    2. 尝试清单中的第一个代换： `'*' -> folder2/file3`

    3. 代换结果为非相对名称 -- 将其与 *baseUrl* 结合，得到`projectRoot/folder2/file3.ts`

    4. 文件不存在，移至第二个代换

    5. 第二个代换 `generated/*` 得到 `generated/folder2/file3`

    6. 代换结果为非相对名称 -- 将其与 *baseUrl* 结合，得到 `projectRoot/generated/folder2/file3.ts`

    7. 文件存在，解析完毕。


### 使用`rootDirs`的虚拟目录（Virtual Directories with `rootDirs`）

有时，编译时多个目录的全部项目源码，都要被结合在一起，从而生成一个单一的输出目录。这种做法可被视为由一个源代码目录集合，创建出一个“虚拟”目录（This can be viewed as a set of source directories create a "virtual" directory）。

通过使用`'rootDirs'`选项（在`tsconfig.json`中），就可以告知编译器组成该“虚拟”路径的 “roots”（根目录）；而因此编译器就可以在这些“根目录”中， *像是* 在单个目录中融合在一起那样，对这些相对模块导入项进行解析了（Using `"rootDirs"`, you can inform the compiler of the *roots* making up this "virtual" directory; and thus the compiler can resolve relative modules imports within these "virtual" directories *as if* were merged together in one directory）。

试想下面的项目解构作为示例：

```bash
 src
 └── views
     └── view1.ts (imports './template1')
     └── view2.ts

 generated
 └── templates
         └── views
             └── template1.ts (imports './view2')
```

`src/views`中的文件是一些UI控件的用户代码。`generated/templates`中的文件则是由模板生成器自动生成的、作为构建一部分的UI模板绑定代码。构建的一步，将把`/src/views`与`/generated/templates/views`中的文件进行拷贝到输出中的同一目录。而在运行时，某个视图就可以期望它的模板是存在于它旁边的，并因此而可以使用一个如同`"./template"`这样的相对名称，对模板进行导入（A build step will copy the files in `/src/views` and `/generated/templates/views` to the same directory in the output. At run-time, a view can expect its template to exist next to ti, and thus should import it using a relative name as `"./template"`）。

要将这种关系指明给编译器，就使用`"rootDirs"`选项。该选项指明一个 *根目录（roots）* 清单，其中的内容希望在运行时进行融合。因此根据这里的示例，其`tsconfig.json`文件就应该像下面这样：

```json
{
    "compilerOptions": {
        "rootDirs": [
            "src/views",
            "generated/templates/views"
        ]
    }
}
```

随后编译器一旦见到`rootDirs`清单中任意条目的子目录中的相对模块导入项，其就会尝试在`rootDirs`的各个条目中查找该导入项。

`rootDirs`的灵活性不仅仅在于指明要被逻辑融合的一个物理源码目录清单。所提供的数组可包含任意数目的特定条目、任意的目录名称，而不管这些目录是否存在。这就令到编译器可对复杂捆绑与诸如条件包含及特定于项目的加载器插件等运行时特性，以类型安全的方式进行捕获（The flexibility of `rootDirs` is not limited to specifying a list of physical source directories that are logically merged. The supplied array may include any number of ad hoc, arbitary directory names, regardless of whether they exist or not. This allows the compiler to capture sophisticated bundling and runtime features such as conditional inclusion and project specified loader plugins in a type safe way）。

试想这样一个国际化场景，其中通过以相对模块路径的一部分，比如`./#{locale}/messages`，而插入一个特殊令牌，比如`#{locale}`，构建工具从而自动生成特定语言环境程序包（Consider an internationalization scenario where a build tool automatically generates locale specific bundles by interpolating a special path token, say `#{locale}`， as part of a relative module path such as `./#{locale}/messages`）。在这种假定设置下，构建工具将对所支持的语言环境进行枚举，而映射到抽象路径`./zh/messages`、`./de/messages`等等。

假设这些语言模块都导出了一个字符串数组。比如`./zh/messages`可能包含：

```typescript
export default [
    "您好吗",
    "很高兴认识你"
];
```

利用`rootDirs`，就可以告诉编译器这种映射，从而安全地对`./#{locale}/messages`进行解析，尽管该目录根本不会存在。以下面的`tsconfig.json`文件为例：

```json
{
    "compilerOptions": {
        "rootDirs": [
            "src/zh",
            "src/de",
            "src/#{locale}"
        ]
    }
}
```

现在编译器将会以工具目的，把`import messages from './#{locale}/messages'` 解析到 `import messages from './zh/messages'`，从而允许在语言环境不可知下的开发，不受设计时间支持的威胁（allowing development in a locale agnostic manner without compromising design time support）。

### 对模块解析进行追踪（Tracing module resolution）

正如前面所讲到的，在对模块进行解析时，编译器可访问位处当前文件夹外部的文件。这会导致难于诊断某个模块不能解析，或被解析到不正确的定义的原因。而通过使用`--traceResolution`，开启编译器模块解析追踪（the compiler module resolution tracing）特性，就能提供到在模块解析过程中发生了什么的信息。

假设有着一个使用了`typescript`模块的示例应用。`app.ts`具有像是`import * as ts from "typescript"`这样的导入项。

```bash
│   tsconfig.json
├───node_modules
│   └───typescript
│       └───lib
│               typescript.d.ts
└───src
        app.ts
```

以`--traceResolution`选项来调用编译器

```bash
tsc --traceResolution
```

将得到如下的输出：

```bash
======== Resolving module 'typescript' from 'src/app.ts'. ========
Module resolution kind is not specified, using 'NodeJs'.
Loading module 'typescript' from 'node_modules' folder.
File 'src/node_modules/typescript.ts' does not exist.
File 'src/node_modules/typescript.tsx' does not exist.
File 'src/node_modules/typescript.d.ts' does not exist.
File 'src/node_modules/typescript/package.json' does not exist.
File 'node_modules/typescript.ts' does not exist.
File 'node_modules/typescript.tsx' does not exist.
File 'node_modules/typescript.d.ts' does not exist.
Found 'package.json' at 'node_modules/typescript/package.json'.
'package.json' has 'types' field './lib/typescript.d.ts' that references 'node_modules/typescript/lib/typescript.d.ts'.
File 'node_modules/typescript/lib/typescript.d.ts' exist - use it as a module resolution result.
======== Module name 'typescript' was successfully resolved to 'node_modules/typescript/lib/typescript.d.ts'. ========
```

***要查找的项目***

+ 导入项的名称与位置

> ======== Resolving module 'typescript' from 'src/app.ts'. ========

+ 编译器依循的策略

> Module resolution kind is not specified, using 'NodeJs'.

+ 来自npm软件包的加载类型（Loading of types from npm packages）

> 'package.json' has 'types' field './lib/typescript.d.ts' that references 'node_modules/typescript/lib/typescript.d.ts'.

+ 最终结果

> ======== Module name 'typescript' was successfully resolved to 'node_modules/typescript/lib/typescript.d.ts'. ========

### `--noResolve`选项的使用（Using `--noResolve`）

通常编译器在开始编译过程前，会先尝试对所有模块导入项进行解析。在每次成功地将一个`import`解析到一个文件后，该文件就被加入到于稍后将进行处理的一个文件集合中。

编译器选项`--noResolve`通知编译器不要将那些未在命令行传递的文件，“添加” 到编译过程。编译器仍会尝试将模块解析到文件，但如该文件未被指定，其就不会被包含进去（The `--noResolve` compiler options instructs the compiler not to "add" any files to the compilation that were not passed on the command line. It will still try to resolve the module to files, but if the file is not specified, it will not be included）。

举例来说：

*app.ts*

```typescript
import * as A from "moduleA" // 没有问题，‘moduleA’在命令行上有传入
import * as B from "moduleB" // Error TS2307: Cannot find module 'moduleB'.
```

```bash
tsc app.ts moduleA.ts --noResolve
```

使用`--noResolve`选项来编译`app.ts`将导致：

+ 因为`moduleA`有在命令行上传入，其被正确地找到

+ 而因为`moduleB`未被传入，故因无法找到`moduleB`而报错

### 常见问题（Common Questions）

***为何一个排除清单中的模块，仍被编译器拾取到了？***

***Why does a module in the exclude list still get picked up by the compiler?***

`tsconfig.json`文件可将文件夹转变为一个“项目”（`tsconfig.json` turns a folder into a "project"）。在没有指定任何`exclude`或`include`条目时，包含了`tsconfig.json`的文件夹中的所有文件，及该文件夹的所有子目录，都是包含在编译中的。如打算使用`"exclude"`来排除某些文件，还不如通过使用`files`来指定所需的文件，从而让编译器来查找这些文件。

那就是`tsconfig.json`的自动包含特性。拿不会嵌入上面所讨论的模块解析。在编译器识别到作为某个模块导入项的目标文件时，该文件将自动包含到编译中，而不管其是否被排除在前面的步骤（That was `tsconfig.json` automatic inclusion. That does not embed module resolution as discussed above. If the compiler identified a file as a target of a module import, it will be included in the compilation regardless if it was excluded in the previous steps）。

所以要将某个文件排除在编译之外，就需要将其与 **所有** 有着到它的`import` 或 `/// <reference path="...">`指令的文件，都要排除。
