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

注意这里的`y`有着一个额外的`location`属性，但这并不会造成错误。在对兼容性进行检查时，仅会考虑目标类型（这里也就是`Named`）的那些成员。

该比较过程是递归进行的，对每个成员及子成员进行遍历（This comparison process proceeds recursively, exploring the type of each member and sub-member）。

## 两个函数的比较（Comparing two functions）

可以看出，对原生类型与对象类型的比较是相对直接的，而何种函数应被看着是兼容的这个问题，就牵扯到更多方面了（While comparing primitive types and object types is relatively straightforward, the question of what kinds of functions should be considered is a bit more involved）。下面就以两个仅在参数清单上不同的函数的基本示例开始：

```typescript
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // 没有问题

// TSError: ⨯ Unable to compile TypeScript
// src/main.ts (9,1): Type '(b: number, s: string) => number' is not assignable to type '(a: number) => number'. (2322)
x = y; // 错误
```

为检查`x`是否可被赋值给`y`，首先要看看参数清单。`x`中的每个参数，在`y`中都必须有一个类型兼容的参数与其对应。注意参数名称是不考虑的，考虑的仅是它们的类型。在本示例中，函数`x`的每个参数，在`y`中都有一个兼容的参数与其对应，因此该赋值是允许的。

第二个赋值是错误的赋值，因为`y`有着必要的第二个参数，`x`并没有，因此该赋值是不允许的。

对于示例中`y = x`之所以允许“丢弃”参数的原因，在JavaScript中，此种忽略额外函数参数的赋值，实际上是相当常见的。比如`Array#forEach`方法就提供了3个参数给回调函数：数组元素、数组元素的索引，以及所位处的数组。不过，给其一个仅使用首个参数的回调函数，仍然是很有用的：

```typescript
let items = [1, 2, 3];

// Don't force these extra parameters
items.forEach((item, index, array) => console.log(item));

// 这样也是可以的
items.forEach(item => console.log(item));
```

现在来看看返回值类型是如何加以对待的，下面使用两个仅在放回值类型上有所区别的函数：

```typescript
let x = () => ({name: "Alice"});
let y = () => ({name: "Alice", location: "Seattle"});

x = y; // 没有问题

// TSError: ⨯ Unable to compile TypeScript
// src/main.ts (6,1): Type '() => { name: string; }' is not assignable to type '() => { name: string; location: string; }'.
//  Type '{ name: string; }' is not assignable to type '{ name: string; location: string; }'.
//    Property 'location' is missing in type '{ name: string; }'. (2322)
y = x; // 错误，因为`x`缺少一个location属性
```

类型系统强制要求 **源函数** 的返回值类型，是 **目标函数** 返回值类型的一个子集（The type system enforces that the source function's return type be a subtype of the target type's return type）。

### 函数参数的双向协变（Funtion Parameter Bi-variance）

在对函数参数的类型进行比较时，加入源参数可被赋值给目标参数，或目标参数可赋值给源参数，那么函数间的赋值将成功。这是不完备的，因为某个调用器可能以被给予一个取更为具体类型的函数，却以不那么具体类型，来触发该函数而结束。在实践中，此类错误很少见，同时此特性带来了很多常见的JavaScript模式（When comparing the types of function parameters, assignment succeeds if either the source parameter is assignable to the target parameter, or vice versa. This is unsound because a caller might end up being given a function that takes a more specialized type, but invokes the funtion with a less specialized type. In practice, this sort of error is rare, and allowing this enables many common JavaScript patterns）。下面是一个简要的示例：

```typescript
enum EventType { Mouse, Keyboard }

interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }
interface KeyEvent extends Event { keyCode: number }

function listenEvent (eventType: EventType, handler: (n: Event) => void) {
    //...
}

//不完备，却是有用且常见的做法
listenEvent(EventType.Mouse, (e.MouseEvent) => console.log(e.x + "," + e.y));

// 具备完备性的不可取做法
listenEvent(EventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x + "," + (<MouseEvent>e>).y);
listenEvent(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x + "," + e.y));

// 下面这样写是仍然不允许的（肯定是错的）。因为完全不兼容类型，而强制开启类型安全（Still disallowed (clear erro). Type safety enforced for wholly incompatible types）
listenEvent(EventType.Mouse, (e: number) => console.log(e));
```

### 可选参数与其余参数（Optional Parameters and Rest Parameters）

在出于兼容性而对函数加以比较时，可选参数与必需参数是通用的。源类型的额外可选参数并不是一个错误，同时目标类型的、在源类型中没有对应参数的可选参数也不是一个错误（When comparing functions for compatibility, optional and required parameters are interchangeable. Extra optional parameters of the source type are not an error, and optional parameters of the target type without corresponding parameters in the source type are not an error）。

在某个函数具有其余参数时，其余参数就被当成是有无限个可选参数加以对待（When a function has a rest parameter, it is treated as if it were an infinite series of optional parameters）。

这一点从类型系统角度看是不完备的，但因为对于大多数函数来数，在那个位置传递`undefined`都是等效的，因此从运行时角度，可选参数这一概念通常并不是精心构思的（This is unsound from a type system perspective, but from a runtime point of view the idea of an optional parameter is generally not well-enforced since passing `undefined` in that position is equivalent for most functions）。

下面的示例就是某个取一个回调函数，并以可预测（对于程序员）却未知（对于类型系统）数量的参数来触发该回调函数的函数的常见模式（The motivating example is the common pattern of a function that takes a callback and invokes it with some predictable(to the programmer) but unknown(to the type system) number of arguments）:

```typescript
function invokeLater(args: any[], callback: (...args: any[]) => void) {
    /* 以 args 来触发回调函数 */
}

// 不完备 -- invokeLater "可能" 提供任意数量的参数
invokeLater([1, 2], (x, y) => console.log(x + ", " + y));

// 混乱（x与y实际上是必需的）且无法发现（Confusing ( x and y are actually required ) and undiscoverable ）
invokeLater([1, 2], (x?, y?) => console.log(x + ", " + y));
```

### 带过载的函数（Functions with overloads）

当函数有着过载时，那么源类型中的每个过载，在目标类型上都必须有一个兼容的签名与其匹配。这样才能确保目标函数可与源函数所在的同样场合进行调用（When a function has overloads, each overload in the source type must be matched by a compatible signature on the target type. This ensures that the target function can be called in all the same situation as the source function）。

## 枚举的兼容性

枚举与数字兼容，同时数字也与枚举兼容。不同枚举类型的枚举值，被看着是兼容的。比如：

```typescript
enum Status { Ready, Waiting };
enum Color { Red, Blue, Green };

let status = Status.Ready;
status = Color.Green; // 没毛病
```

