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

在诸如C#或Java这样的 **名义类型语言** 中，等效代码将报出错误，因为类`Person`并未显式地将其描述为是`Named`接口的一个 **实现器** （In **nominally-typed languages** like C# or Java, the equivalent code would be an error because the `Person` class does not explicity describe itself as being an **an implementor** of the `Named` interface）。

TypeScript的结构化类型系统，是基于JavaScript代码的一般编写方式而设计的。因为JavaScript广泛用到诸如函数表达式及对象字面值这样的匿名对象，因此使用结构化类型系统而非名义类型系统，对于表示JavaScript的那些库中所发现的关系种类，就更加自然一些（TypeScript's structural type system was designed based on how JavaScript code is typically written. Because JavaScript widely uses anonymous objects like function expressions and object literals, it's much more natural to represent the kinds of relationships found in JavaScript libraries with a structural type system instead of a nominal one）。

### 关于可靠性/健全性的说明（A Note on Soundness）

TypeScript的类型系统，令到一些在编译时无法知晓的操作是安全的。当某个类型系统具备了此种属性时，就说其不是“健全的”。至于TypeScript允许在哪里存在不健全行为，则是被仔细考虑过的，贯穿本文，这里将对这些特性于何处发生，以及它们背后的动机场景，加以解释（TypeScript's type system allows certain operations that can't be known at compile-time to be safe. When a type system has this property, it is said to not be "sound". The places where TypeScript allows unsound behavior were carefully considered, and throughout this document we'll explain where these happen and the motivating scenarios behind them）。

## 开始（Starting out）

TypeScript的结构化类型系统的基本规则，就是在`y`具备与`x`相同成员时，`x`就兼容`y`。比如：

```typescript
interface Named {
    name: string;
}

let x: Named;

// y 所引用的类型是 { name: string; location: string; }
let y = { name: "Alice", location: "Seattle" };

x = y;
```

编译器要检查这里的`y`是否可以被赋值给`x`，就会对`x`的各个属性进行检查，以在`y`中找到相应的兼容属性。在本例中，`y`必须具有一个名为`name`的字符串成员。而它确实有这样的一个成员，因此该赋值是允许的。

```typescript
interface Named {
    name: string;
    age: number;
}

let x: Named;

// y 所引用的类型是 { name: string; location: string; }
let y = { name: "Alice", location: "Seattle" };

// TSError: ⨯ Unable to compile TypeScript
// src/main.ts (12,1): Type '{ name: string; location: string; }' is not assignable to type 'Named'.
//  Property 'age' is missing in type '{ name: string; location: string; }'. (2322)
x = y;
```

在对函数调用参数进行检查时，也使用到通用的赋值规则（The same rule for assignment is used when checking function call arguments）：

```typescript
function greet (n: Named) {
    alert ("Hello, " + n.name);
}

greet(y); // 没有问题
```

