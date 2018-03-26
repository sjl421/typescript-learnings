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


