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


