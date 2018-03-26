# 类型兼容性

**Type Compatibility**

## 简介

TypeScript中的类型兼容性，是基于结构化子类型赋予的。结构化的类型赋予，是一种仅依靠类型的成员，而将这些类型联系起来的方式。这一点与名义上的类型赋予有所不同（Type compatibility in TypeScript is based on structural subtyping. Structural typing is a way of relating types based solely on their members. This is in contrast with nominal typing）。请考虑以下代码：

```typescript
interface Named {
    name: string;
}

class Person {
    name: string;
}

let p: Named;

// 没有问题，因为这里的结构化类型赋予
p = new Person();
```

在诸如C#或Java这样的名义类型语言（nominally-typed languages）中，等效代码将报出错误，因为类`Person`并未显式地将其描述为是`Named`接口的一个实现器（an implementor）。


