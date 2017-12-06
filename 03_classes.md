## 类（Classes）

## 简介

传统的JavaScript使用函数与基于原型的继承（prototype-based inheritance），来建立可重用的组件。但这种处理会令到那些习惯于面向对象方法的程序员不自在，面向对象方法有着功能继承、对象建立自类等特性。从ECMAScript 2015, 也就是ES6开始，JavaScript程序员就可以使用面向对象的、基于类的方法，来构建他们的应用了。在TypeScript中，现在就可以用上这些技术，并将其向下编译到可工作于所有主流浏览器与平台的JavaScript，而无需等待下一版的JavaScript。

## 关于类

让我们来看一个简单的基于类的实例吧：

```typescript
class Greeter {
    greeting: string;

    constructor ( message: string ) {
        this.greeting = message;
    }

    greet () {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter ("world");
```

如你之前曾使用过C#或Java, 那么就应该对这段代码的语法比较熟悉了。这里声明了一个新的类`Greeter`（declare a new class `Greeter`）。此类有三个成员：一个名为`greeting`的属性，一个构建器，以及一个方法`greet`。

在类中，将注意到当对该类的某个成员进行引用时，在该成员前加上了`this.`。这就表名那是一个成员访问（a member access）。

上面代码的最后一行使用`new`关键字构建出该`Greeter`类的一个实例（construct an instance of the `Greeter` class by using `new`）。这调用了先前所定义的构建函数（constructor, 构建器），从而以该`Greeter`为模型，进行新对象的创建，并运行该构造函数对其进行初始化。

## 继承（Inheritance)

在TypeScript中可使用通常的面向对象模式（common object-oriented patterns)。而基于类编程的最为基础模式之一，就是具备运用继承，对既有类加以扩展，从而创建出新类的能力了。

看看这个示例：

```typescript
class Animal {
    
}
