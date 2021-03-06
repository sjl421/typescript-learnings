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

函数参数会逐一检查，以每个相应参数位置的类型，与对应的类型进行检查的方式进行（Function parameters are checked one at a time, with the type in each corresponding parameter position checked against each other）。如完全不打算指定类型，那么TypeScript的上下文类型系统就可以推断出参数类型，因为该函数值是直接赋予给`SearchFunc`类型的变量的。同时，这里函数表达式的返回值类型，是由其返回值（也就是`false`或`true`）隐式给出的。加入让该函数返回数字或字符串，那么类型检查器（the type-checker）就会发出返回值类型与`SearchFunc`接口中描述的返回值类型不符的警告。

```typescript
let mySearch: SearchFunc;
mySearch = function (src, sub) {
    let result = src.search(sub);
    return result > -1;
}
```

## 可索引的类型（Indexable Types）

与使用接口来描述函数类型类似，还可以使用接口类描述那些可以索引的类型（types that we can "index into"），比如`a[10]`，抑或`ageMap["daniel"]`这样的。可索引类型有着一个描述用于在该对象内部进行索引的类型的 *索引签名（index signature）*，以及在索引时返回值的类型。来看看这个示例：

```typescript
interface StringArray {
    [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

在上面的代码中，有着一个带有索引签名的`StringArray`接口。此索引签名指出在某个`StringArray`以某个`number`加以索引时，它将返回一个`string`。

TypeScript支持的索引签名有两种类型：字符串及数字。同时支持这两种类型的索引器是可能的，但从某个数字的索引器所返回的类型，则必须是从字符串索引器所返回类型的子类型（It is possible to support both types of indexers, but the type returned from a numeric indexer must be a subtype of the type returned from the string indexer）。这是因为在以某个`number`进行索引时，JavaScript实际上会在对某个对象进行索引前，将其转换成`string`。也就是说，在使用`100`（`number`）来进行索引时，实际上与使用`"100"`（`string`）效果是一样的，因此二者就需要一致（That means that indexing with `100` (a `number`) is the same thing as indexing with `"100"` (a `stirng`), so the two need to be consistent）。

```typescript
class Animal {
    name: string;
}

class Dog extends Animal {
    breed: string;
}

// Numeric index type 'Animal' is not assignable to string index type 'Dog'. (2413)
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}
```

尽管字符串的索引签名是描述“字典”模式的一种强大方式，但它们同时强制了与它们的返回值类型匹配的属性值（While string index signatures are a powerful way to describe the "dictionary" pattern, they also enforce that all properties match their return type）。这是因为字符串的索引申明了`obj.property`同时与`obj["property"]`可用。在下面的示例中，`name`的类型与该字符串索引器的类型并不匹配，那么类型检查器就会给出一个错误：

```typescript
//Property 'name' of type 'string' is not assignable to string index type 'number'. (2411)
interface NumberDictionary {
    [index: string]: number;
    length: number;
    name: string;
}
```

最后，为了阻止对指数的赋值，就可以将这些索引签名置为只读（Finally, you can make index signatures readonly in order to prevent assignment to their indices）:

```typescript
interface ReadonlyStringArray {
    readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = ["Alice", "Bob"];
//Index signature in type 'ReadonlyStringArray' only permits reading. (2542)
myArray[2] = "Mallory";
```

因为此处的索引签名是只读的，因此这里就不能设置`myArray[2]`了。


## 类的类型（Class Types）

###应用某个接口（Implementing an interface）

在诸如C#及Java这样的语言中，接口的一种最常用方式，就是显式地强调某个类满足一种特定的合约，那么在TypeScript中，这样做也是可能的。

```typescript
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor (h: number, m: number) {}
}
```

在接口中还可以对将在类中应用到的方法进行描述，就像下面示例中对`setTime`所做的那样：

```typescript
interface ClockInterface {
    currentTime: Date;
    setTime (d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;

    setTime (d: Date) {
        this.currentTime = d;
    }

    constructor (h: number, m: number) {}
}
```

接口对类的公共侧进行了描述，而不是同时描述公共及私有侧。这就禁止对使用接口来对同时有着特定类型的该类实例的私有面的类，进行检查（Interfaces describe the public side of the class, rather than both the public and private side. This prohibits you from using them to check that a class also has particular types for the private side of the class instance）。

### 类的静态与实例侧（Difference between the static and instance sides of classes）

在与类一同使用接口是时，记住类有着两种类型：静态侧的类型与示例侧的类型（the type of the static side and the type of the instance side），是有帮助的。或许已经注意到在使用构建签名来建立一个接口，并尝试应用此接口来建立类的时候，将报出一个错误：

```typescript
interface ClockInterface {
    new (hour: number, minute: number);
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor (h: number, m: number) {}
}
```

这是因为在某个类应用某个接口时，仅有该类的实例侧被检查了。因为该构建器位处静态侧，所以其并不包含在此检查中。

那么就需要直接在该类的静态侧上动手了。在此实例中，定义了两个接口：用于构建器的`ClockConstrutor`与用于实例方法的`ClockInterface`。随后为便利起见，这里定义了一个构建器函数`createClock`，以创建出传递给它的该类型的实例。

```typescript
interface ClockConstrutor {
    new (hour: number, minute: number): ClockInterface;
}

interface ClockInterface {
    tick();
}

function createClock (ctor: ClockConstrutor, hour: number, minute: number): ClockInterface {
    return new ctor (hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor (h: number, m: number) {}

    tick () {
        console.log("beep beep");
    }
}

class AnalogClock implements ClockInterface {
    constructor (h: number, m: number) {}

    tick () {
        console.log("tick tock");
    }
}

let digital = createClock (DigitalClock, 12, 17);
let analog = createClock (AnalogClock, 7, 32);
```

因为`createClock`第一个参数是`ClockConstrutor`, 那么在`createClock(AnalogClock, 7, 32)`中，它就对`AnalogClock`有着正确的构建签名进行检查。

## 扩展接口（Extending Interfaces）

与类一样，接口也可以相互扩展。此特性令到将某接口的成员拷贝到另一接口可行，这就在将接口分离为可重用组件时，提供更多的灵活性。

```typescript
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square> {};
square.color = "blue";
square.sideLength = 10;
```

一个接口还可以对多个接口进行扩展，从而创建出所有接口的一个联合（a combination of all of the interfaces）：

```typescript
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}


interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = <Square> {};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

## 混合类型（Hybrid Types）

正如早先所提到的那样，接口具备描述存在于真实世界JavaScript中的丰富类型（As we mentioned earlier, interfaces can describe the rich types present in real world JavaScript）。由于JavaScript的动态且灵活的天性，因此偶尔会遇到某个对象将以结合上述各种类型的方式运作的情况。

这类实例之一，就是某个对象同时以函数与对象，并带有一些属性方式行事：

```typescript
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter (): Counter {
    let counter = <Counter> function (start: number) {};
    counter.interval = 123;
    counter.reset = function () {};
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

在与第三方JavaScript（注：TypeScript, 你，别人的程序）交互时，就需要使用上面这样的模式，来充分描述类型的形状（When interacting with 3rd-party JavaScript, you may need to use patterns like the above to fully describe the shape of the type）。

## 对类进行扩展的接口（Interface Extending Classes）

当某个接口对类类型进行扩展时，它将继承该类的成员，却不继承这些成员的实现（When an interface type extends a class type, it inherits the members of the class but not their implementations）。这就如同接口已经对该类的所有成员进行了声明，而没有提供到其具体实现。接口甚至会继承到某个基类的私有及受保护成员。那就意味着在创建某个对带有私有及保护成员的类进行扩展的接口时，所建立的接口类型，就只能被被扩展的类所其子类所应用（实现，It is as if the interface had declared all of the members of the class without providing an implementation. Interfaces inherit even the private and protected members of a base class. This means that when you create an interface that extends a class with private or protected members, that interface type can only be implemented by that class or a subclass of it）。

在有着大的继承层次时，此特性是有用的，但需要指出的是，这只在代码中有着仅带有确定属性的子类时才有用（This is useful when you have a large inheritance hierarchy, but want to specify that your code works with only subclass that have certain properties）。这些子类除了继承自基类外，不必是有关联的。比如：

```typescript
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select (): void;
}

class Button extends Control implements SelectableControl {
    select () {}
}

class TextBox extends Control {}

//Class 'Image' incorrectly implements interface 'SelectableControl'.
//Property 'state' is missing in type 'Image'. (2420)
class Image implements SelectableControl {
    select () {}
}

class Location {}
```

在上面的示例中，`SelectableControl`包含了所有`Control`的成员，包括私有的`state`属性。因为`state`是一个私有成员，因此对于`Control`的后代，就只可能去应用`SelectableControl`这个接口了。这是因为只有`Control`的后代，才会有着这个源自同一声明的`state`私有成员，这也是私有成员可用的一个要求（Since `state` is a private member it is only possible for descendants of `Control` to implement `SelectableControl`. This is because only descendants of `Control` will have a `state` private member that originates in the same declaration, which is a requirement for private members to be compatible）。

在`Control`这个类中，通过`SelectableControl`的某个实例去访问`state`这个私有成员，是可能的。同时，某个`SelectableControl`也会与一个已知有着`select`方法的`Control`那样行事（Effectively, a `SelectableControl` acts like a `Control` that is known to have a `select` method）。这里的`Button`与`TextBox`都是`SelectableControl`的子类型（因为它们都是继承自`Control`，并有着`select`方法）, 但`Image`与`Location`就不是了。
