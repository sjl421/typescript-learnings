# 装饰器

**Decorators**

## 简介

随着TypeScript及ES6中类的引入，就有了一些需要对类与类的成员进行批注与修改等额外特性的场景（With the introduction of Classes in TypeScript and ES6, there now exist certain scennarios that require additional features to support annotating or modifying classes and class members）。装饰器这一特性，就提供了一种将类声明与成员的批注与元编程语法加入进来的方式。装饰器特性，是一项JavaScript的[第二阶段提议](https://github.com/tc39/proposal-decorators)，且是TypeScript的一项实验特性。

> 注意：装饰器是一项实验特性，在以后的版本发布中可能改变。

要开启装饰器的实验性支持，就必须在命令行或`tsconfig.json`中开启编译器的`experimentalDecorators`选项：

**命令行**：

```bash
tsc --target ES5 --experimentalDecorators
```

**tsconfig.json**

```json
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

## 关于装饰器（Decorators）

*装饰器* 是一类特殊的声明，可被附加到[类的声明](#class-decorators)、[方法](#method-decorators)、[访问器](#accessor-decorators)、[属性](#property-decorators)或者[参数](#parameter-decorators)。装饰器使用的形式是`@expression`，其中的`expression`必须评估为一个将在运行时，以有关被装饰声明的信息被调用的函数（Decorators use the form `@expression`, where `expression` must evaluate to a function that will be called at runtime with information about the decorated declaration）。

比如，对于给定的装饰器`@sealed`，那么就可能向下面这样写该`sealed`函数：

```typescript
function sealed(target) {
    // ... 对`target`进行一些操作 ...
}
```

> 注意：在下面的[类装饰器](#class-decorators)中，可以看到更详细的示例

### 装饰器工厂（Decorator Factories）
<a href="decorator-factories"></a>

可通过编写一个装饰器工厂，来对装饰器作用于声明的方式进行定制。 *装饰器工厂* 就是一个返回由装饰器在运行时调用的表达式的函数（If you want to customize how a decorator is applied to a declaration, we can write a decorator factory. A *Decorator Factory* is simply a function that returns the expression that will be called by the decorator at runtime）。

可以下面的形式，来编写一个装饰器工厂：

```typescript
function color (value: string) { // 这是装饰器工厂
    return function (target) { // 这是装饰器
        // 以`target`与`value`来完成一些操作
    }
}
```

> 注意，在下面的[方法装饰器](#method-decorators)部分，可见到装饰工厂的更详细示例。

### 装饰器的复合（Decorator Composition）

对某个声明，可应用多个装饰器，如下面的示例中那样：

+ 在同一行：

    ```typescript
    @f @g x
    ```

+ 在多行上：
    
    ```typescript
    @f
    @g
    x
    ```

当有多个装饰器应用到单个声明时，它们的执行与[数学中的复合函数](http://en.wikipedia.org/wiki/Function_composition)类似。在这个模型中，当将`f`与`g`进行复合时，`(f∘ g)(x)`复合结果与`f(g(x))`等价。

因此，TypeScript中在对单一声明上的多个装饰器进行执行时，将完成以下步骤：

1. 各个装饰器的表达式将自顶向下执行。

2. 随后的结果作为函数被自底向上进行调用。

当使用了[装饰器工厂](#decorator-factories)，就可以在下面的示例中观察到这种执行顺序：

```typescript
function f() {
    console.log("f(): evaluated");

    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called");
    }
}

function g() {
    console.log("g(): evaluated");

    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("g(): called");
    }
}

class C {
    @f()
    @g()
    method() {}
}
```

其将把下面的输出打印到控制台：

```bash
f(): evaluated
g(): evaluated
g(): called
f(): called
```

### 装饰器求值（Decorator Evaluation）

对于将装饰器如何应用到类内部的各种声明，有着以下可遵循的定义良好的顺序：

1. 对于各个实例成员， *参数装饰器*，接着分别是 *方法*、*访问器* 或者 *属性装饰器* 将被应用（ *Parameter Decorators*, followed by *Method*, *Accessor*, or *Property Decorators* are applied for each instance member）。

2. 对于各个静态成员， *参数装饰器*，接着分别是 *方法*、*访问器* 或者 *属性装饰器* 将被应用（ *Parameter Decorators*, followed by *Method*, *Accessor*, or *Property Decorators* are applied for each static member）。

3. 对于构造器，将应用参数装饰器（ *Parameter Decorators* are applied for the constructor）。

4. 对于类，将应用 *类装饰器* （ *Class Decorators* are applied for the class ）。

### 类装饰器

*类装饰器* 是在类声明之前、紧接着类声明处声明的。类声明作用与类的构造器，而可用于对类的定义进行观察、修改或替换。类装饰器不能在声明文件，或任何其它外围上下文中使用（比如在某个`declare`类上。The class decorator is applied to the constructor of the class and can be used to observe, modify or replace a class definition. A class decorator cannot be used in a declaration file, or in any other ambient context(such as on a `declare` class)）。

> 什么是TypeScript的外围上下文（ambient context, 有的翻译为“已有环境”）?
    > 
    >

类装饰器的表达式，将被作为一个函数，在运行时以被装饰的类的构造器函数，作为唯一参数而被调用。

> **注意** 应注意返回一个新的构造器函数，因为必须注意维护好原来的原型。运行时对装饰器的应用这一逻辑，并不会做这件事（Should you chose to return a new constructor function, you must take care to maintain the original prototype. The logic that applies decorators at runtime will not do this for you）。

下面是一个应用到`Greeter`类的类装饰器（`@sealed`）的示例：

```typescript
@sealed
class Greeter {
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }

    greeter () {
        return `Hello, { this.greeting }`;
    }
}
```


