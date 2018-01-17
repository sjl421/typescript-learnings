# 接口（Interfaces）

## 简介

TypeScript语言的核心原则之一，就是类型检查着重于值所具有的 *形（shape）*（One of TypeScript's core principles is that type-checking focuses on the *shape* that values have）。这有时候被称为“[鸭子类型（duck typing）](https://zh.wikipedia.org/wiki/%E9%B8%AD%E5%AD%90%E7%B1%BB%E5%9E%8B)” 或 “[结构化子类型（structural subtyping）](https://openhome.cc/Gossip/Scala/StructuralTyping.html)”。在TypeScript中，接口充当了这些类型名义上的角色，且是一种定义代码内的合约（约定），以及与项目外部代码的合约约定的强大方式（In TypeScript, interfaces fill the role of naming these types, and are a powerfull way of defining contracts within your code as well as contracts with code outside of your project）。


## 接口初步（Our First Interface）

理解接口的最容易方式，就是从一个简单的示例开始：

```typescript
function printLable (labelledObj: { label: string }) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};

printLable(myObj);
```

类型检查器对`printLable`的调用进行检查。函数`printLable`有着一个单独参数，该参数要求所传入的对象要有一个名为`label`、类型为字符串的属性。请注意这里的`myObj`实际上有着更多的属性，但编译器对传入的参数只检查其 *至少* 有着列出的属性，且要匹配要求的类型。当然也存在TypeScript编译器不那么宽容的情形，这一点在后面会讲到。

可以再次编写此示例，这次使用接口来描述需要具备`label`属性这一要求：

```typescript
interface LabelledValue {
    label: string;
}

function printLable ( labelledObj: LabelledValue ) {
    console.log(labelledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLable (myObj);
```

这里的`LabelledValue`接口，是一个立即可用于描述前一示例中的要求的名称。它仍然表示有着一个名为`label`、类型为字符串的属性。请注意这里并没有像在其它语言中一样，必须显式地说传递给`printLable`的对象应用该接口。这里只是那个 *形（shape）* 才是关键的。如果传递给该函数的对象满足了列出的要求，那么就是允许的。

这里需要指出的是，类型检查器不要求这些属性以何种顺序进入，只要有接口所要求的属性及类型即可。


## 可选属性（Optional Properties）

接口可以包含并不需要的属性。在特定条件下某些属性存在，或根本不存在（Not all properties of an interface may be required. Some exist under certain conditions or may not be there at all）。在建立像是那种将某个仅有少数属性的对象，传递给某个函数的“选项包（option bags）”的模式时，这些可选属性用得比较普遍。

下面是此种模式的一个示例：

```typescript
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare ( config: SquareConfig ): {color: string; area: number} {
    let newSquare = {color: "white", area: 100};

    if (config.color) {
        newSquare.area = config.with * config.width;
    }

    return newSquare;
}

let mySquare = createSquare({color: "black"});
```

带有可选属性的接口，其写法与其它接口相似，只需在各个可选属性的声明中，在属性名字的末尾，以`?`加以表示即可。

使用可选属性的优势在于，在对可能存在的属性进行描述的同时，仍然可以阻止那些不是该接口组成部分的属性的使用。比如在将`createSquare`中的`color`属性错误拼写的情况下，就会收到提醒的错误消息：

```typescript
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare ( config: SquareConfig ): { color: string; area: number } {
    let newSquare = { color: "white", area: 100 };
    //Property 'clor' does not exist on type 'SquareConfig'. Did you mean 'color'? (2551) 
    if (config.color) {
        newSquare.color = config.clor;
    }

    if ( config.width ) {
        newSquare.area = config.width * config.width;
    }

    return newSquare;
}

let mySquare = createSquare({color: "black"});
```

## 只读属性（Readonly properties）

一些属性只应在对象刚被创建时是可修改的。那么可通过将`readonly`关键字放在该属性名称前，对这些属性加以指定。

```typescript
interface Point {
    readonly x: number;
    readonly y: number;
}
```

就可以通过指派一个对象文字（an object literal），构建出一个`Point`出来。在赋值过后，`x`与`y`就再也不能修改了。

```typescript
let p1: Point = { x: 10, y: 20 };
p1.x = 5; //Cannot assign to 'x' because it is a constant or a read-only property. (2540)
```

TypeScript 有着一个`ReadonlyArray<T>`类型，该类型与`Array<T>`一致，只是移除了所有变异方法（with all mutating methods removed），因此向下面这样就可以确保在某个数组创建出后，不会被修改：

```typescript
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; //Index signature in type 'ReadonlyArray<number>' only permits reading. (2542)
ro.push(5); //Property 'push' does not exist on type 'ReadonlyArray<number>'. (2339) 
ro.length = 100;//Cannot assign to 'length' because it is a constant or a read-only property. (2540)
a = ro;//Type 'ReadonlyArray<number>' is not assignable to type 'number[]'
```

上面这段代码中最后一行可以看出，将整个`ReadonlyArray`往回赋值给正常数组，也是非法的。但仍然可以使用一个类型断言（a type assertion），以消除此错误：

```typescript
a = ro as number[];
```

### `readonly` 与 `const`的区别

对于要使用`readonly`或`const`，最简单的办法就是区分是要在变量上，还是属性上使用。对于变量，当然就用`const`，属性则用`readonly`。

## 关于多余属性检查（Excess Property Checks）

在采用了接口的第一个示例中，TypeScript令到可将`{size: number; label: string;}`传递给某些仅期望一个`{label: string;}`的地方。后面还介绍了关于可选属性，以及可选属性在名为“选项包（option bags）”的地方如何发挥作用。

但是，如像在JavaScript中那样，将这两个特性单纯地结合在一起，就足以杀死你自己，下面就用最后一个示例使用`createSquare`来说明一下：

```typescript
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare ( config: SquareConfig ): { color: string; area: number } {
    // ...
}

let mySquare = createSquare ({ colour: "red", width: 100 });
```

注意这里给予`createSquare`的参数被写成了`colour`，而不是`color`。在普通的JavaScript中，这类错误将不会报错。

对于这个诚实，你可能会说没有错误拼写，因为`width`属性是兼容的，没有`color`属性出现，同时这里额外的`colour`属性是不重要的。

不过，TypeScript会认为在这段代码中存在问题。对象字面值会受到特别对待，同时在将对象字面值赋予给其它变量，或者将它们作为参数加以传递时，而收到 *多余属性检查*。如某个对象字面值有着任何目标对象不具有的属性时，就会报出错误。

```typescript
// Argument of type '{ colour: string; width: number; }' is not assignable to parameter of type 'SquareConfig'.
// Object literal may only specify known properties, but 'colour' does not exist in type 'SquareConfig'. Did you mean to write 'color'? (2345)
let mySquare = createSquare({colour: "red", width: 100});
```

绕过此类检查实际上相当简单。最容易的做法就是使用一个类型断言（a type assertion）：

```typescript
let mySquare = createSquare({width: 100, opacity: 0.5} as SquareConfig);
```

不过，在确定对象可能有某些在特别情况下会用到额外属性时，一种更好的方式就是为其添加一个字符串的索引签名（a string index signature）。比如在这里的`SquareConfig`们就可以有着上面`color`与`width`属性，但也可以具有任意数量的其它属性，那么就可以将其定义成下面这样：

```typescript
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

索引签名这个概念在后面会涉及，这里说的是`SquareConfig`可以有着任意数量的属性，而只要这些属性不是`color`或`width`就可以，它们的类型并不重要。

绕过这些检查的一种终极方式，可能有点意外，就是将该对象赋值给另一变量：因为`squareConfig`不会受多余属性检查，因此编译器也就不会给出错误。

```typescript
let squareConfig = { colour: "red", width: 100 };
let mySquare = createSquare(squareConfig);
```

请记住对于像是上面的简单代码，一般不必尝试“绕过”这些检查。而对于更为复杂的、有着方法并存有状态的对象字面值（complex object literals that have methods and hold state），可能就要牢记这些技巧了，但大多数的多余属性错误，都是真实存在的bugs。那就意味着在使用诸如选项包（option bags）这类的特性，而出现多余属性检查类问题时，就应该对类型定义加以审视。在此实例中，如果允许将某个有着`color`或`colour`属性的对象传递给`createSquare`方法，那么就要修改`SquareConfig`的定义，来反应出这一点。

## 函数的类型（Function Types）

对于描述JavaScript的对象所能接受的范围宽广的形，接口都是可行的（Interfaces are capable of describing the wide range of shapes that JavaScript objects can take）。除了用于描述带有属性的对象，接口还可以描述函数类型。

要用接口来描述函数，就要给予该接口一个调用签名（a call signature）。这就像是一个仅有着参数清单与返回值类型的函数声明。参数清单中的各参数，都要求名称与类型。

```typescript
interface SearchFunc {
    (source: string, subString: string): boolean;
}
```

一旦定义好，就可以像使用其它接口一样，对此函数类型接口（this function type interface）进行使用了。这里展示了创建一个某种函数类型的变量，并把同一类型的函数值赋予给它的过程（create *a variable of a function type* and assign it *a function value* of the same type）。

```typescript
let mySearch: SearchFunc;
mySearch = function (source: string; subString: string) {
    let result = source.search(subString);
    return result > -1;
}
```

参数名称无需匹配，就可以对函数类型进行正确的类型检查。比如这里可以像下面这样编写上面的示例：

```typescript
let mySearch: SearchFunc;
mySearch = function (src: string, sub: string): boolean {
    let result = src.search(sub);
    return result > -1;
}
```

函数参数会逐一检查，以每个相应参数位置的类型，与对应的类型进行检查的方式进行（Function parameters are checked one at a time, with the type in each corresponding parameter position checked against each other）。如完全不打算指定类型，那么TypeScript的上下文类型系统就可以推断出参数类型，因为该函数值是直接赋予给`SearchFunc`类型的变量的。
