# 类型推导

**Type Inference**

## 简介

本章节将涵盖TypeScript中的类型推导。也就是说，这里将讨论类型在何处及如何被推导。

## 类型推导基础

在TypeScript中，有好几个地方都使用到类型推导，来处理那些没有显式类型注解（explicit type annotation）时，用于提供类型的信息。比如，在下面的代码中：

```typescript
let x = 3;
```

变量`i`的类型，就被推导为`number`。这种推导，是在对变量及成员进行初始化、参数默认值的设置（setting parameter default values），以及确定函数返回值类型等期间发生的。

大多数情况下，类型推导都是直截了当的。在下面部分中，将对类型是如何进行推导的细微之处，进行探讨。

## 最优通用类型（Best common type）

当类型推导是从几个表达式生成的时，这些表达式的类型，就被用作计算出一个“最优通用类型”。比如：

```typescript
let x = [0, 1, null];
```

为推导出上面示例中`x`的类型，就必须考虑各个数组元素的类型。这里给到的该数组类型有两个选择：`number`与`null`。 **最优通用类型算法** 就对各个候选类型加以考虑，并选取那个兼容所有其它候选项的类型（ **the best common type algorithm** considers each candidate type, and picks the type that is compatible with all the other candidates）。

因为必须要从所提供的候选类型选出最优通用类型，那么就有着某些候选类型共享一个通用结构，却并存在一个作为所有候选类型超集的类型的情况。比如：

```typescript
let zoo = [new Rhino(), new Elephant(), new Snake()];
```

理想情况下，可能希望将`zoo`推导为一个`Animal[]`，但因为该数组中没有对象是严格的`Animal`类型，所以无法做出有关该数组元素类型的推导。为了纠正这一点，就要在没有一种类型是其它候选类型的超类型时，提供显式地提供一个类型：

```typescript
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
```

而在找不到最佳通用类型时，推导结果就是联合数组类型（the union array type），`(Rhino | Elephant | Snake)[]`。

## 上下文的类型（Contextual Type）

在TypeScript中，类型推导在某些情况下还以“其它方向”起作用（Type inference also works in "the other direction" in some cases in TypeScript）。这就是所谓的“上下文的赋予类型（contextual typing）”。上下文类型赋予是在某个表达式的类型由其所处位置所决定时，发生的。比如：

```typescript
window.onmousedown = function (mouseEvent) {
    console.log(mouseEvent.button); //<- Error
};
```

为了从上面的代码中检查出错误，TypeScript的类型检查器使用了`window.onmousedown`函数的类型，类推导该赋值语句右侧的函数表达式的类型（For the code above to give the type error, the TypeScript type checker used the type of the `window.onmousedown` function to infer the type of the function expression on the right hand side of the assignment）。在其这样做的时候，就能够推导出`mouseEvent`参数的类型。而假如该函数表达式并不是在一个上下文类型赋予位置（not in a contextually typed position），那么参数`mouseEvent`将有着类型`any`，从而不会出现任何错误。

而如果上下文类型赋予的表达式（the contextually typed expression）包含了显式的类型信息，那么上下文类型将被忽略。也就是像下面这样写上面的示例：

```typescript
window.onmousedown = function (mouseEvent: any) {
    console.log(mouseEvent.button); // <- Now, no error is given
};
```

参数上带有显式类型注记的函数表达式，将覆盖上下文类型。而一旦这样做，就不会报出错误了，因为应用没有上下文类型特性。

在很多情况下，上下文类型赋予都得以应用。常见的包括函数调用的参数、赋值语句的右侧、类型断言、对象的成员与数组字面值，以及返回语句等（Contextual typing applies in many cases. Common cases include arguments to function calls, right hand sides of assignments, type assertions, members of object and array literals, and return statements）。在最佳通用类型中，上下文类型也扮演了一种候选类型。比如：

```typescript
function createZoo(): Animal[] {
    return [new Rhino(), new Elephant(), new Snake()];
}
```

在此示例中，最佳通用类型有着四种候选类型的集合：`Animal`、`Rhino`、`Elephant`以及`Snake`。其中`Animal`可能会被最佳通用类型算法选中。
