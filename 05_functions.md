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

在JavaScript中，`this`是于某个函数被调用时，设置的一个变量。这就令到其成为一项非常强大且灵活的特性，不过其代价就是务必要知悉函数执行所在的上下文。这是非常容易搞混的，尤其是在返回值是个函数，或将函数作为参数加以传递时（注：也就是回调函数，callback。In JavaScript, `this` is a variable that's set when a function is called. This makes it a very powerful and flexible feature, but it comes at the cost of always having to know about the context that a function is executing in. This is notoriously confusing, especially when returning a function or passing a function as an argument）。

请看一个示例：

```typescript
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function () {
        return function () {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker ();
let pickedCard = cardPicker ();

alert ("card: " + pickedCard.card + " of" + pickedCard.suit);
```

请注意`createCardPicker`是一个本身返回函数的函数。如果运行此示例，将得到一个错误（`Uncaught TypeError: Cannot read property 'suits' of undefined`），而不是期望的警告框。这是因为在有`createCardPicker`所创建的函数中所使用的`this`，将被设置为`window`而不是`deck`对象。那是因为这里是在`cardPicker`本身上对其进行调用的。像这样的 **顶级非方法（对象的方法）语法调用**，将使用`window`作为`this`（注意：严格模式下，`this`将是`undefined`而不是`window`。Notice that `createCardPicker` is a function that itself returns a function. If we tried to run the example, we would get an error instead of the expected alert box. This is because the `this` being used in the function created by `createCardPicker` will be set to `window` instead of our `deck` object. That's because we call `cardPicker` on its own. **A top-level non-method syntax call** like this will use `window` for `this`. (Note: under strict mode, `this` will be `undefined` rather than `window`)）。

要解决此问题，只需要在返回该函数以便后续使用之前，确保该函数是绑定到正确的`this`就可以了。这样的话，无论后续如何被使用该函数，它都能够参考最初的`deck`对象了。为实现此目的，这里就要将该函数表达式，修改为使用ECMAScript 6的箭头语法。箭头函数实在函数被创建时捕获`this`，而不是在函数被调用时。

```typescript
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function () {
        // 注意：现在下面这行是一个箭头函数，令到可以立即对`this`进行捕获
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker ();
let pickedCard = cardPicker ();

alert ("card: " + pickedCard.card + " of" + pickedCard.suit);
```

更甚者，如将`--noImplicitThis`编译指令传递给编译器，那么TypeScript就会在代码中有着此类错误时，给出警告。编译器将指出`this.suits[pickedSuit]`中的`this`的类型为`any`。

### `this` 参数（`this` parameters）

不幸的是，`this.suits[pickedSuit]`的类型，仍然是`any`。这是因为`this`来自于该对象字面值内部的函数表达式。要解决这个问题，就可以提供到一个显式的`this`参数。`this`参数都是位于函数参数清单的第一个位置，是假参数（Unfortunately, the type of `this.suits[pickedCard]` is still `any`. That's because `this` comes from the function expression inside the object literal. To fix this, you can provide an explicit `this` parameter. `this` parameters are fake parameters that come first in the parameter list of a function）:

```typescript
function f(this: void) {
    // 确保`this`在此对立函数中是不可用的的（make sure `this` is unusable in this standalone function）
}
```

来给上面的示例加入接口 `Card` 与 `Deck`，从而使得类型更为清晰明了而更易于重用：

```typescript
interface Card {
    suit: string;
    card: number;
}

interface Deck {
    suits: string [];
    cards: number [];
    createCardPicker (this: Deck): () => Card; 
}

let deck: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // 注意：此函数现在显式地指明了其被调必须是类型`Deck`（NOTE: The function now explicitly specifies 
    // that its callee must be of type Deck）

    createCardPicker: function (this: Deck) {
        return () => {
            let pickedCard = Math.floor (Math.random() * 52);
            let pickedSuit = Math.floor (pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker ();
let pickedCard = cardPicker ();

console.log("Card: " + pickedCard.card + " of " + pickedCard.suit);
```

现在TypeScript就知道了`createCardPicker`期望是在`Deck`对象上被调用了。那就意味着现在的`this`是`Deck`类型，而不再是`any`类型了，由此`--noImplicitThis`编译指令也不会再引起任何的错误了。


### 回调函数中的`this`

在将函数传递给将随后掉用到这些函数的某个库时，对于回调函数中的`this`，也是非常容易出错的地方。因为调用回调函数的库，将像调用普通函数那样调用回调函数，所以`this`将是`undefined`。同样，作出一些努力后，也可以使用`this`参数，来防止回调中错误的发生。首先，编写库的同志们，你们要使用`this`来对回调类型加以注释：

```typescript
interface UIElement {
    addClickListener (onclick: (this: void, e: Event) => void): void;
}
```

`this: void` 指的是`addClickListener`期望`onclick`是一个不要求`this`类型的函数（`this: void` means that `addClickListener` expects `onclick` to be a function that does not require a `this` type）。

接着，使用`this`来对调用代码进行注释：

```typescript
class Handler {
    info: string;
    onClickGood (this: void, e: Event) {
        // 这里是无法使用`this`的，因为其为`void`类型
        console.log('clicked!');
    }
}

let h = new Handler ();
uiElement.addClickListener (h.onClickGood);
```

因为`onClickGood`将其`this`类型指定为了`void`，所以传递给`addClickListener`是合法的。当然，这也意味着`onClickGood`不能使用`this.info`了。如既要传递给`addClickListener`又要使用`this.info`，那么就不得不使用一个箭头函数了（箭头函数在创建时捕获`this`，调用时不捕获）。

```typescript
class Handler {
    info: string;
    onClickGood = (e: Event) => { this.info = e.message; }
}
```


