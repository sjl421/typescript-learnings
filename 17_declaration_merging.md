# 声明融合特性

**Declaration Merging**

## 简介

TypeScript中有一些特有概念，它们在类型级别对JavaScript对象外形进行描述（Some of the unique concepts in TypeScript describe the shape of JavaScript objects at the type level）。一个尤其特定于TypeScript的例子，就是“声明融合”这一概念。对此概念的掌握，对于与现有Javascript操作，较有优势。对此概念的掌握，也开启了其它复杂抽象概念的大门。

作为本文的目标，“声明融合”特性，就是指编译器把两个以相同名称进行声明的单独声明，融合为一个单一声明。融合后的声明，有着原先两个声明的特性。任意数目的声明都可被融合；而不受限于仅两个声明。

## 基本概念

在TypeScript中，一个声明将创建出至少三组之一的实体：命名空间、类型或值。命名空间创建式声明创建出包含可通过使用 *点缀符号* 进行访问的名称的命名空间。类型创建式声明，则仅完成这些：它们创建出一个对所声明的外形可见，且绑定到给定名称的类型。最后值创建式声明创建的是在输出的JavaScript中可见的数值（In TypeScript, a declaration creates entities in at least one of three groups: namespace, type, or value. Namespace-creating declarations create a namespace, which contains names that are accessed using a dotted notation. Type-creating declarations do just that: they create a type that is visible with the declared shape and bound to the given name. Lastly, value-creating declarations create values that are visible in the output JavaScript）。

| 声明类型 | 命名空间 | 类型 | 数值 |
| :--- | :--: | :--: | :--: |
| 命名空间 | X |   | X |
| 类 |   | X | X |
| 枚举 |   | X | X |
| 接口 |   | X |   |
| 类型别名 |   | X |   |
| 函数 |   |   | X |
| 变量 |   |   | X |

对各种声明都创建了什么的掌握，有助于理解哪些在执行声明融合时被融合了。


## 接口的融合（Merging Interfaces）

最简单也是最常见的声明融合类别，要数接口融合。在最基础阶段，这种融合机械地将两个声明的成员，以那个相同的名称结合起来。

```typescript
interface Box {
    height: number;
    width: number;
}

interface Box {
    scale: number;
}

let box: Box = {height: 5, width: 6, scale: 10};
```

这些接口的非函数成员都应唯一。如出现重复，那么重复的成员应具有相同类型。在接口声明了有相同名称，类型却不一样的非函数成员时，编译器将发出错误。

对于接口中的函数成员，名称相同的各个函数，是以对同一函数的过载进行对待的（For function members, each function member of the same name is treated as describing an overload of the same function）。需要说明的是，在接口`A`与其后的接口`A`融合的情况下，那么第二个接口比第一个接口有着较高的优先权。

那就是说，在下面的示例中：

```typescript
interface Cloner {
    clone(animal: Animal): Animal;
}

interface Cloner {
    clone(animal: Sheep): Sheep;
}

interface Cloner {
    clone(animal: Dog): Dog;
    clone(animal: Cat): Cat;
}
```

这三个接口将融合为创建一个下面的单一的接口：

```typescript
interface Cloner {
    clone(animal: Dog): Dog;
    clone(animal: Cat): Cat;   
    clone(animal: Sheep): Sheep;
    clone(animal: Animal): Animal;
}
```

注意每个分组的元素，保持了同样顺序，而各分组本身则以较后过载集合靠前的顺序被融合的（Notice that the elements of each group maintains the same order, but the groups themselves are merged with later overload sets ordered first）。

这条规则的一个例外，就是特殊签名（specialized signatures）。在某个签名具有类型为 *单一* 字符串字面值类型（就是说不是字符串字面值的联合）的参数时，那么该函数将被提升到其融合过载清单的顶部（If a signature has a parameter whose type is a *single* string literal type(e.g. not a union of string literals), then it will be bubbled toward the top of its merged overload list）。

举例来说，下面这些接口将融合到一起：

```typescript
interface Document {
    createElement(tagName: any): Element;
}

interface Document {
    createElement(tagName: "div"): HTMLDivElement;
    createElement(tagName: "span"): HTMLSpanElement;
}

interface Document {
    createElement(tagName: string): HTMLElement;
    createElement(tagName: "canvas"): HTMLCanvasElement;
}
```

融合后的`Document`将是下面这样：

```typescript
interface Document {
    createElement(tagName: "canvas"): HTMLCanvasElement;
    createElement(tagName: "div"): HTMLDivElement;
    createElement(tagName: "span"): HTMLSpanElement;
    createElement(tagName: string): HTMLElement;
    createElement(tagName: any): Element;   
}
```

## 命名空间的融合（Merging Namespaces）

与接口类似，相同名称的命名空间也将对其成员进行融合。因为命名空间同时创建了命名空间与值，所以需要掌握命名空间与值二者是如何进行融合的。

为对命名空间进行融合，来自在各个命名空间中定义的导出接口的类型定义自身被融合，从而形成一个单一的，内部有着这些接口定义的命名空间（To merge the namespaces, type definitions from exported interfaces declared in each namespaces are themselves merged, forming a single namespace with merged interface definitions inside）。

为对命名空间值进行融合，那么在各声明处，如已存在有着给定名称的命名空间，那么其就被通过以取得既有命名空间并将第二个命名空间所导出的成员加入到前一个的方式，被进一步扩展（To merge the namespace value, at each declaration site, if a namespace already exists with the given name, it is further extended by taking the existing namespace and adding the exported members of the second namespace to the first）。

看看下面这个示例中`Animals`的声明融合：

```typescript
namespace Animals {
    export class Zebra {}
}

namespace Animals {
    export interface Legged { numberOfLegs: number; }
    export class Dog {}
}
```

其等价于：

```typescript
namespace Animals {
    export interface Legged { numberOfLegs: number; }

    export class Zebra {}
    export class Dog {}
}
```

这种命名空间融合模式作为起点是有用的，但也需要掌握对于非导出成员，是怎样进行融合的。 非导出成员仅在原始（未融合的）命名空间中可见。这就意味着在融合之后，来自其它声明的已融合成员，是无法看到那些非融合成员的。

在下面的示例中，可更清楚的看到这一点：

```typescript
namespace Animal {
    let haveMuscles = true;

    export function animalsHaveMuscles () {
        return haveMuscles;
    }
}

namespace Animal {
    export function doAnimalsHaveMuscles () {
        return haveMuscles; // <-- 错误，`haveMuscles` 在这里不可见
    }
}
```

因为`haveMuscles`未被导出，所以只有共享了同一未融合命名空间的`animalsHaveMuscles`函数才能看到该符号（the symbol）。而对于`doAnimalsHaveMuscles`函数，尽管其是融合后的`Animal`命名空间的一部分，其仍然不能看到这个未导出成员。

## 命名空间与类、函数及枚举的融合（Merging Namespaces with Classes, Functions, and Enums）

因为命名空间有足够的灵活性，故其可与其它类型的声明进行融合。而要与其它类型的声明融合，命名空间就 **必须** 位于要与其融合的声明之后。融合得到的声明，将有着所融合声明类型的各自属性。TypeScript利用这种功能，来模仿JavaScript及其它编程语言的某些模式（The resulting declaration has properties of both declaration types. TypeScript uses this capability to model some of the patterns in JavaScript as well as other programming languages）。

### 命名空间与类的融合（Merging Namespaces with Classes）

这么做给出了一种描述内层类的方式：

```typescript
class Album {
    label: Album.AlbumLabel;
}

namespace Album {
    export class AlbumLabel {}
}
```

被融合成员的可见性规则与“命名空间融合”小节中所讲到的相同，因此为让该融合的类`AlbumLabel`可见，就必须将其导出。融合结果就是在另一个类中进行管理的一个类。还可以使用命名空间，来将更多静态成员加入到既有的类中（The end result is a class managed inside of another class. You can also use namespaces to add more static members to an existing class）。

出了内层类（inner classes）这种模式之外，还有那种建立一个函数并于随后通过往函数上加入属性，来进一步扩展函数的JavaScript做法。TypeScript是通过使用声明融合，来以类型安全的方式，构造类似定义的。

```typescript
function buildLabel(name: string): string {
    return buildLabel.prefix + name + buildLabel.suffix;
}

namespace buildLabel {
    export let suffix = "";
    export let prefix = "Hello, ";
}

alert(buildLabel("Sam Smith"));
```

