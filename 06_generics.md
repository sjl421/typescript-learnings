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


