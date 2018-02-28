# 泛型（Generics）

## 简介

软件工程的一个主要部分，就是有关不仅有着良好定义并具备一致性，而且具备可重用性组件的构建（A major part of software engineering, is building components that not only have well-defined and consistent APIs）。既可处理现今的数据，又能处理往后的数据的组件，对于构建大型软件系统，将带来最灵活的效能。

在诸如C#与Java这样的程序语言中，它们工具箱中用于可重用组件创建的主要工具之一，就是 *泛型（generics）*，借助于泛型特性，就可以创建出可工作于不同类型，而非单一类型的组件。这就允许用户对组件进行消费，并使用其各自的类型。

（注：[Wikipedia：泛型](https://en.wikipedia.org/wiki/Generic_programming) ）

## 泛型入门

这里以泛型特性的“Hello World”开始。下面的`identity`函数将返回任何传递给它的东西。可将其想作与`echo`命令类似。

在没有泛型特性时，就要么必须给予该`identity`函数某种指定类型：

```typescript
function identity (arg: number): number {
    return arg;
}
```

或者使用`any`类型类描述该`identity`函数：

```typescript
function identity (arg: any): any {
    return arg;
}
```

尽管使用`any`具备泛型，因为这样做导致该函数接收任何且所有类型的`arg`，不过实际上丢失了函数返回值时的类型。比如假设传入了一个数字，能得到的信息就仅是可返回任意类型（While using `any` is certainly genric in that it will cause the fucntion to accept any and all types for the type of `any`, we actually are losing the information about what that type was when the function returns. If we passed in a number, the only information we have is that any type could be returned）。

取而代之的是，这里需要某种捕获参数类型的方式，通过此方式带注解将返回何种类型。那么这里将使用 *类型变量（type variable）*，类型变量与作用在值上的变量不同，其是一种作用在类型上的变量（Instead, we need a way of capturing the type of the argument in such a way that we can also use it to denote what is being returned. Here, we will use a *type variable*, a special kind of variable that works on types rather than values）。

```typescript
function identity<T> (arg: T): T {
    return arg;
}
```

现在已经给`identity`函数加上了一个类型变量`T`。此`T`允许对用户提供的类型进行捕获（比如：`number`），因此就可以于随后使用该信息。这里再度使用`T`作为返回值类型。在检查时，就可以看到对参数与返回值类型，使用的是同一种类型了。这样做就允许将函数一侧的类型信息，运送到另一侧。

那么就说此版本的`identity`就是泛型的了，因为其在一系列的类型上都可运作。与使用`any`不同，泛型的使用与上面的第一个对参数与返回值类型都用了数字的`identity`函数同样精确（也就是其并没有丢失任何信息）。

而一旦写好这个泛型的`identity`函数，就可以两种方式对其进行调用了。第一种方式是将所有参数，包括参数类型，传递给该函数：

```typescript
let output = identity<string>("myString");
```

这里显式地将`T`置为`string`，作为函数调用的参数之一，注意这里使用的`<>`而非`()`进行注记。

第二种方式，也是最常见的了。就是使用 *类型参数推理(type argument inference)* -- 也就是，让编译器基于传递给它的参数类型，来自动设定`T`的值。

```typescript
let output = identity("myString"); // 输出类型将是 `string`
```

注意这里不必显式地传入尖括号（the angle brackets, `<>`）中的类型；编译器只需查看值`myString`，并将`T`设置为`myString`的类型。尽管类型参数推理在保持代码简短及更具可读性上，能够作为一项有用的工具，但在一些更为复杂的示例中可能发生编译器无法完成类型推理时，仍需像先前的示例那样，显式地传入类型参数，

## 泛型类型变量的使用（Working with Generic Type Variables）

在一开始使用泛型时，将注意到在创建诸如`identify`这样的函数时，编译器将强制在函数体中正确地使用任意泛型的类型化参数。那就是说，实际上可将这些参数，像是任意及所有类型那样对待（When you begin to use generics, you'll notice that when you create generic functions like `identity`, the compiler will enforce that you use any generically typed parameters in the body of the function correctly. That is, that you actually treat these parameters as if they could be any and all types）。

这里仍然以前面的`identity`函数做示例：

```typescript
function identity<T>(arg: T): T {
    return arg;
}
```

那么如果在各个调用中要同时记录参数`arg`的长度到控制台会怎样呢？就可能会尝试这样来编写：

```typescript
function identity<T>(arg: T): T {
    console.log(arg.length); // Property 'length' does not exist on type 'T'. (2339)
    return arg;
}
```

这样做的话，编译器将给出一个在成员`arg`上使用`.length`的错误，然而没有那里说过`arg`上有着此成员。请记住，前面已经提及到，这些类型变量代替的是`any`及所有类型，因此使用此函数的某个人可能传入的是一个`number`，而一个`number`显然是没有`.length`成员的。

这里实际上是要该函数在`T`的数组上操作，而不是在`T`上。而一旦对数组进行操作，那么`.length`成员就可用了。可像下面将创建其它类型的数组那样，对此进行描述：

```typescript
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length); // 因为数组有着长度，因此不再发生错误
    return arg;
}
```

可将`loggingIdentity`的类型，读作“通用函数`loggingIdentity`，获取一个类型参数`T`，以及一个为`T`的数组的参数`arg`，而返回一个`T`的数组”（"the generic function `loggingIdentity` takes a type parameter `T`, and an argument `arg` which is an array of `T`s, and returns an array of `T`s"）。在将一个数字数组传递进去时，将获取到一个返回的数字数组，同时`T`将绑定到`number`类型。这就允许将这里的泛型变量`T`作为所处理的类型的一部分，而非整个类型，从而带来更大的灵活性（This allows us to use our generic type variable `T` as part of the types we're working with, rather than the whole type, giving us greater flexibility，这里涉及两个类型，泛型`T`及泛型`T`的数组，因此说`T`是处理类型的部分）。

还可以将同一示例，写成下面这种形式：

```typescript
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);
    return arg;
}
```

其它语言中也有此种写法。下一小节，将探讨如何创建自己的诸如`Array<T>`这样的泛型。


## 泛型（Generic Types）

上一小节中，创建出了通用的、可处理一系列类型的identity函数。本小节中，将就该函数本身的类型，以及如何创建通用接口，进行探索。

通用函数的类型（the type of generic functions）与非通用函数一样，以所列出的类型参数开始，类似与函数的声明：

```typescript
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
```

对于类型中的泛型参数，则可以使用不同的名称，只要与类型变量的数目及类型变量使用顺序一致即可（We could also have used a different name for the generic type parameter in the type, so long as the number of type variables and how the type variables are used line up）。

```typescript
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <U>(arg: U) => U = identity;
```

还可以将该泛型写为某对象字面类型的调用签名（a call signature of an object literal type）：

```typescript
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: {<T>(arg: T): T} = identity;
```

这就引入编写首个通用接口（the generic interface）的问题了。这里把上一示例中的对象字面值，改写为接口的形式：

```typescript
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T) T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

在类似示例中，可能想要将通用参数，修改为整个接口的一个参数。这样做可获悉是对那些类型进行泛型处理（比如，是`Dictionary<string>`而不只是`Dictionary`）。这样处理可将类型参数暴露给该接口的其它成员（In a similar example, we may want to move the generic parameter to be a parameter of the whole interface. This lets us see what type(s) we're generic over(e.g. `Dictionary<string>` rather than just `Dictionary`). This makes the type parameter visible to all the other members of the interface）。

```typescript
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T) T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

请注意这里的示例已被修改为有一点点的不同了。这里有了一个作为泛型一部分的非通用函数，取代了对一个通用函数的描述。现在使用`GenericIdentityFn`时，就需要明确指明一个对应的类型参数了（这里是`number`），从而有效锁定当前调用签名所具体使用的类型。掌握何时将类型参数直接放在调用签名上，以及何时将其放在接口本身上，对于阐明泛型的各个方面是有帮助的（Instead of describing a generic function, we now have a non-generic function signature that is a part of a generic type. When we use `GenericIdentityFn`, we now will also need to specify the corresponding type argument(here: `number`), effectively locking in what the underlying call signature will use. Understanding when to put the type parameter directly on the call signature and when to put it on the interface itself will be helpful in describing what aspects of a type are generic）。

除开通用接口，还可以创建通用类。但请注意是不能创建通用枚举与命名空间的。

## 通用类（Generic Classes）

通用类与通用接口有着类似外观。通用类在类名称之后，有着一个于尖括号（`<>`）中所列出的泛型参数清单（A generic class has a similar shape to a generic interface. Generic classes have a generic type parameter list in angle brackets(`<>`) following the name of the class）。

```typescript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {return x+y;};
```

这是对`GenericNumber`类的相当直观的用法了，不过可能会注意到这里并没有限制该类仅使用`number`类型。因此可以使用`string`甚至更复杂的JavaScript对象。

```typescript
let stringNumeric = new GenericNumber<string>();

stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) { return x + y; };

alert(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

与接口一样，将类型参数放在类本身上，可确保该类的所有属性，都与同一类型进行运作。

如同在[类部分](03_classes.md)所讲到的，类在其类型上有两侧：静态侧与示例侧。通用类则仅在示例侧是通用的，静态侧不具有通用性，因此在使用类时，静态成员无法使用到类的类型参数。

## 泛型约束（Generic Constraints）

如还记得早先的一个示例，有时候在了解到某些类型集所具备的功能时，而想要编写一个处理类型集的通用函数。在示例`loggingIdentity`中，是打算能够访问到`arg`的`length`属性，但编译器却无法证实每个类型都有`length`属性，因此它就警告无法做出此种假定。

```typescript
function identity<T>(arg: T): T {
    console.log(arg.length); // Property 'length' does not exist on type 'T'. (2339)
    return arg;
}
```

为了避免处理任意与所有类型，这里就要将该函数约束为处理有着`length`属性的任意及所有类型。只要类型具有该成员，这里允许该类型，但仍要求该类型至少具备该属性。为了达到这个目的，就必须将这里的要求，作为`T`可以是何种类型的一个约束加以列出。

做法就是，创建出一个描述约束的接口。下面将创建一个具有单一`.length`的接口，并使用该接口及`extends`语句，来表示这里的约束：

```typescript
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length); // 现在知道`arg`有着一个`.length`属性，因此不再报出错误
    return arg;
}
```

因为该通用函数现在已被约束，故其不再对任意及所有类型运作：

```typescript
loggingIdentity(3); // 错误，数字没有`.length`属性
```

相反，这里需传入那些具有全部所需属性类型的值：

```typescript
loggingIdentity({length: 10; value: 3});
```

### 在泛型约束中使用类型参数（Using Type Parameter in Generic Constraints）

定义一个受其它类型参数约束的类型参数，也是可以的。比如这里要从一个对象，经由属性名称而获取到某个属性。肯定是要确保不会偶然去获取某个并不存在于该`obj`上的属性，因此就将在两个类型上，加上一条约束（You can declare a type parameter that is constrained by another type parameter. For example, here we'd like to get a property from an object given its name. We'd like to ensure that we're not accidentally grabbing a property that does not exist on the `obj`, so we'll place a constraint between the two types）：

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "m"); // Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'. (2345)
```

### 在泛型中使用类类型（Using Class Types in Generics）

在运用泛型来创建TypeScript的工厂（工厂是一种面向对象编程的设计模式，参见[Design patterns in TypeScript: Factory](https://thedulinreport.com/2017/07/30/design-patters-in-typescript-factory/), [oodesign.com: Factory Pattern](http://www.oodesign.com/factory-pattern.html)）时，有必要通过类的构造函数，对类的类型加以引用（When creating factories in TypeScript using generics, it is necessary to refer to class types by their constructor functions）。比如：

```typescript
function create<T>(c: { new(): T; }): T {
    return new c();
}
```

下面是一个更为复杂的示例，其使用了原型属性，来推断及约束构造函数与类的类型实例侧之间的关系（A more advanced example uses the prototype property to infer and constrain relationships between the constructor function and the instance side of class types）。

```typescript
class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag; // 
createInstance(Bee).keeper.hasMask;
```
