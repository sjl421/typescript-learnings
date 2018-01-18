# 函数（Functions）

## 简介

在JavaScript中，函数是所有应用的基石。正是使用它们来构建出抽象层、模仿类、信息的隐藏，以及模块（Functions are the fundamental building block of any application in JavaScript. They're how you build up layers of abstraction, mimicking classes, information hiding, and modules）。在TypeScript中，尽管有着类、命名空间及模块特性，在描述怎么完成某些事情上，函数仍然扮演了重要角色。为更易于使用函数，TypeScript还为标准的JavaScript函数，加入了一些新的功能。

## 关于函数

如同在JavaScript中那样，一开始呢，TypeScript的函数可以命名函数，或匿名函数的形式予以创建。这就令到可选择对于应用最为适当的方式，无论是在构建API中的一个函数清单，或者构建一个传递给另一函数的一次性函数都行。

下面就用示例来快速地概括JavaScript中这两种方式的样子：

```javascript
// 命名函数
function add (x, y){
    return x+y;
}

//匿名函数
let myAdd = function (x, y) { return x+y; };
```

与在JavaScript中一样，函数可对函数体外部的变量进行引用。在这样做的时候，它们就被叫做对这些变量进行捕获（Just as in JavaScript, functions can refer to variable outside of **the function body**. When they do so, they're said **to `capture` these variables**）。尽管对捕获的原理的掌握，及使用此技巧时所做的权衡超出了本文的范围，对此机制的扎实理解，仍然是熟练运用JavaScript与TypeScript的重要方面。

```typescript
let z = 100;

function addToZ (x, y) {
    return x + y + z;
}
```

## 函数类型（Function Types）

### 给函数赋予类型（Typing the function）

下面就给上一个简单的示例加上类型：

```typescript
function add (x: number, y: number): number {
    return x + y;
}

let myAdd = function (x: number, y: number): number { return x + y; };
```

可将类型添加到各个参数，并于随后以添加类型的方式，为函数本身加上类型。TypeScript可通过查看`return`语句，来推断出返回值的类型，因此在很多情况下就可以省略返回值的类型。

### 函数类型的编写（Writing the function type）

既然已经输入了函数，那么就来通过查看函数类型的各个部分，从而写出该函数的完整类型吧（Now that we've typed the function, let's write the full type of the function out by looking at the each piece of the function type）。

```typescript
// 注意，这里的 myAdd 就是一个函数类型
let myAdd: (x: number, y: number) => number = function (x: number, y: number): number {return x+y;};
```

某个函数的类型，有着同样的两个部分：参数的类型以及返回值类型。在写出整个函数类型时，两个部分都是必须的。参数部分的编写与参数列表一样，给出各个参数名称与类型就可以了。此名称仅对程序的易读性有帮助。因此我们也可以像下面这样编写：

```typescript
let myAdd: (baseValue: number, increment: number) => number =
    function (x: number, y: number): number { return x + y; };
```

一旦有了参数类型这一行，它就会被认为是该函数的有效类型，而不管在函数类型中所给予参数的名称。

第二部分就是返回值类型了。这里是通过在参数与返回值之间使用胖箭头（a fat arrow, `=>`），来表明哪一个是返回值类型的。正如前面所提到的， **返回值类型正是函数类型所必要的部分，因此即使函数没有返回值，也要使用`void`来表示返回值类型，而不是省略掉**。

值得一提的是，函数类型的组成，仅是参数类型与返回值类型。捕获的变量在类型中并未体现出来。实际上，捕获的变量是所有函数的“隐藏状态”的部分，且不构成其API（Captured variables are not reflected in the type. In effect, captured variables are part of the "hidden state" of any function and do not make up its API）。

### 类型推理（Inferring the types）

在上面的示例中，你可能已经注意到，就算只在等号的一侧有类型，TypeScript编译器也能推断出类型：

```typescript
// 这里的 myAdd 有着完整的函数类型
let myAdd = function (x: number, y: number): number { return x+y; };

// 此处 'x' 与 'y' 仍然有着数字类型
let myAdd: (baseValue: number, increment: number) => number =
    function (x, y) {return x+y;};
```

这就叫做“上下文赋型（contextual typing）”，是类型推理的一种形式。此特性有助于降低为维护程序类型化所做的努力（This is called "contextual typing", a form of type inference. This helps cut down on the amount of effort to keep your program typed）。

## 可选参数与默认参数（Optional and Default Parameters）

在TypeScript中，所有参数都假定为是函数所要求的。但这并不意味着参数不可以被给予`null`或`undefined`，相反，在函数被调用时，编译器会对用户是否为各个参数提供了值进行检查。编译器同时也假定这些参数就仅是需要传递给函数的参数。简单的说，给予函数的参数个数，必须与函数所期望的参数个数一致。

```typescript
function buildName ( firstName: string, lastName: string ) {
    return firstName + "" + lastName;
}

let result1 = buildName ( "Bob" );
let result2 = buildName ("Bob", "Adams", "Sr.");
let result3 = buildName ("Bob", "Adams");
```

而在JavaScript中，所有参数都是可选的，同时用户可以在适当的时候省略这些参数。在省略参数时，这些参数就是`undefined`。通过在参数上添加`?`，也能在TypeScript中获得此功能。比如在上一个示例中要令到姓这个参数（the last name parameter）是可选的：

```typescript
function buildName (firstname: string, lastname?: string) {
    if (lastname)
        return firstName + "" lastName;
    else 
        return firstName;
}

let result1 = buildName ( "Bob" );
let result2 = buildName ("Bob", "Adams", "Sr.");
let result3 = buildName ("Bob", "Adams");
```

所有可选参数都应放在必需参数之后。比如这里打算令到名（the first name）可选，而不是姓可选，那么就需要调整函数中参数的顺序，将名放在姓的后面。

在TypeScript中，还可以为参数设置一个默认值，以便在用户没有提供该参数值，或者用户在该参数位置提供了`undefined`时，赋值给那个参数。这类参数叫做已默认初始化了的参数（default-initialized parameters）。这里同样用上一个示例，将姓默认设置为`Smith`。

```typescript
function buildName (firstName: string, lastName = "Smith") {
    return firstName + "  " + lastName;
}

let result1 = buildName ("Bob");
let result2 = buildName ("Bob", undefined);
let result3 = buildName ("Bob", "Adams", "Sr. ");
let result4 = buildName ("Bob", "Adams");
```

位于所有必需参数之后的已默认初始化的参数，是作为可选参数加以处理的，同时与可选参数一样，在对其相应函数进行调用时可以省略。这就意味着可选参数与随后的默认参数，在其类型上有着共性，因此这两个函数：

```typescript
function buildName (firstName: string, lastName?: string) {
    // ...
}
```

与

```typescript
function buildName (firstName: string, lastName = "Smith") {
    // ...
}
```

共用了同样的类型 `(firstName: string, lastName?: string) => string`。在类型中，`lastName`的默认值已然消失了，而只剩下该参数是可选参数的事实。

与普通可选参数不同，已默认初始化的参数，并不需要出现在必需参数后面。在某个已默认初始化参数位处某个必需参数之前时，用户就需要显式地传递`undefined`，以取得默认值。比如，这里可将上一个示例编写为仅在`firstName`上有一个默认初始参数（a default initializer）：

```typescript
function buildName (firstName = "Will", lastName: string) {
    return firstName + "  " + lastName;
}

let result1 = buildName ("Bob"); // 将报错，参数太少
let result2 = buildName ("Bob", "Adams", "Sr. "); // 报错，参数太多
let result3 = buildName ("Bob", "Adams");
let result4 = buildName (undefined, "Adams");
```

## 其余参数（Rest Parameters）

必需参数、可选参数与默认参数，它们都有着一个相同点：它们同时都只能与一个参数交谈。某些情况下，需要处理作为一组的多个参数的情况，或者可能不知道函数最终会取多少个参数。在JavaScript中，可以直接使用每个函数体中都可见的`arguments`变量，来处理此类问题。

在TypeScript中，可将这些参数聚集到一个变量中：

```typescript
function buildName (firstName: string, ...restOfName: string[]) {
    return firstName + "  " + restOfName.join(" "); 
}

let employeeName = buildName ("Joseph", "Sameul", "Lucas", "MacKinzie");
```

*其余参数* 是以数量不限的可选参数加以处理的（ *Rest parameters* are treated as a boundless number of optional parameters）。在将参数传递给某个其余参数时，可传递任意所需数目的参数；一个也不传也是可以的。编译器将构建一个使用位处省略号（the ellipsis, `...`）之后的名称，而传递的那些参数的数组，从而允许在函数中使用到这些参数。

在带有其余参数的函数类型中，也有使用省略号：

```typescript
function buildName (firstName: string, ...restOfName: string[]) {
    return firstName + "  " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
```

## 关于`this`

在JavaScript中，学会如何使用`this`，就相当于是一个成人仪式（Learning how to use `this` in JavaScript is something of a rite of passage）。因为TypeScript是JavaScript的一个超集，那么TypeScript的开发者同样需要掌握怎样使用`this`，以及怎样发现其未被正确使用。

幸运的是，TypeScript提供了几种捕获不正确使用`this`的技巧。如想要了解JavaScript中`this`的运作原理，请移步 Yehuda Katz 的 [Understanding JavaScript Function Invocation and "this"](http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)一文。Yehuda的文章对`this`的内部运作讲得很好，因此这里就只涉及一些基础知识。

### `this`与箭头函数（arrow functions）


