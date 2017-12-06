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

上面代码的最后一行使用`new`关键字构建出该`Greeter`类的一个实例（construct an instance of the `Greeter` class by using `new`）。这调用了先前所定义的构建函数（constructor, 构建器），从而以该`Greeter`为外形(shape)，进行新对象的创建，并运行该构造函数对其进行初始化。

## 继承（Inheritance)

在TypeScript中可使用通常的面向对象模式（common object-oriented patterns)。而基于类编程的最为基础模式之一，就是具备运用继承，对既有类加以扩展，从而创建出新类的能力了。

看看这个示例：

```typescript
class Animal {
    move ( distanceInMeters: number = 0 ) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }    
}

class Dog extends Animal {
    bark () {
        console.log ('Woof! Woof!');
    }
}

const dog = new Dog ();

dog.bark();
dog.move(10);
dog.bark();
```

此实例给出了最基本的继承特性：类自基类继承属性及方法（classes inherit properties and methods from base classes）。这里的`Dog`类是一个使用`extends`关键字，派生自`Animal`这个*基类（base class）*的*派生（derived）*类。派生类（derived classes）通常被称作*子类（subclass）*，同时基类又通常被叫做*超类（superclass）*。

因为`Dog`扩展了来自`Animal`的功能，所以这里就能创建一个可同时`bark()`及`move()`的`Dog`的实例。

再来看一个更复杂的示例：

```typescript
class Animal {
    name: string;

    constructor (theName: string) { this.name = theName; }

    move ( distanceInMeters: number = 0 ) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor (name: string) { super(name); }

    move ( distanceInMeters = 5 ) {
        console.log( "Slithering..." );
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor (name: string) { super(name); }

    move (distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

这个示例涵盖了一些前面没有提到的其它特性。再度看到使用了`extends`关键字建立了`Animal`的两个新子类：`Horse`与`Snake`。

与前一示例的一点不同，就是每个含有构建器的派生类，都**必须**调用`super()`这个方法，以执行到基类的构造函数，否则编译器将报错（`error TS2377: Constructors for derived classes must contain a 'super' call.`, 及`error TS17009: 'super' must be called before accessing 'this' in the constructor of a derived class`）。此外，在构造函数体中，于访问`this`上的某个属性之前，**必须**先调用`super()`方法。TypeScript编译器将强制执行此一规则。

该示例还展示了怎样以特定于子类的方法，覆写基类中方法。这里的`Snake`与`Horse`都创建了一个覆写`Animal`中的`move()`方法的`move()`方法，从而赋予其针对不同类的特定功能。请注意就算`tom`是作为一个`Animal`加以声明的，其值还是一个`Horse`， 对`tom.move(34)`的调用，将调用到`Horse`中所覆写的方法：

```bash
Slithering...
Sammy the Python moved 5m.
Galloping...
Tommy the Palomino moved 34m.
```

## 公共属性、私有属性与受保护的修改器（Public, Private and protected modifiers）

### 属性默认是公共的（Public by default）

在上面这些示例中，可在整个程序中自由地访问到所声明的那些成员。如你熟悉其它语言中的类，那么就可能已经注意到上面的示例中，不必使用`public`关键字来达到此目的；比如，C#就要求显式地给成员打上`public`标签，以令到其对外部可见。而在TypeScript中，默认各成员都是公共的。

当然也可以将某个成员显式地标记为`public`。可以下面的形式编写上一小节中的`Animal`类：

```typescript
class Animal {
    public name: string;

    public constructor ( theName: string ) { this.name = theName; }

    public move ( distanceInMeters: number ) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

### 掌握`private`

当某个成员被标记为`private`时，其就不能从包含它的类的外部访问到了。比如：

```typescript
class Animal {
    private name: string;

    constructor ( theName: string ) { this.name = theName; }
}

new Animal("Cat").name(); // 报错：`name` 是私有的, error TS2341: Property 'name' is private and only accessible within class 'Creature'.
```

TypeScript是一个结构化的类型系统。在比较两个不同的类型时，无论它们来自何处，自要所有成员是相容的，那么就说两个类型本身也是相容的（TypeScript is a structural type system. When we compare two different types, regardless of where they come from, if the types of all members are compatible, then we say the types themselves are compatible）。

但在比较两个有着`private`及`protected`成员的类型时，将加以不同的对待。对于两个被认为是相容的类型，如其中之一有一个`private`成员，那么另一个就必须要有一个源自同样声明的`private`成员。同样的规则也适用于那些`protected`成员（For two types to be considered compatible, if one of them has a `private` member, then the other must have a `private` member that originated in the same declaration. The same applies to `protected` members）。

为搞清楚这一规则在实践中如何发挥作用，让我们看看下面的示例：

```typescript
class Animal {
    private name: string;

    constructor ( theName: string ) { this.name = theName; }
}

Class Rhino extends Animal {
    constructor () { super ('Rhino'); }
}

Class Employee {
    private name: string;

    constructor ( theName: string ) { this.name = theName; }
}

let animal = new Animal ("Goat");
let rhino = new Rhino();
let employee = new Employee('Bob');

animal = rhino;
animal = employee; // 报错： `Animal` 与 `Employee` 并不相容, error TS2322: Type 'Employee' is not assignable to type 'Creature'.  Types have separate declarations of a private property 'name'.
```

此示例有着一个`Animal`与`Rhino`, 其中`Rhino`是`Animal`的一个子类。同时还有一个新的`Employee`类，它在形状上看起来与`Animal`一致。示例中又创建了几个这些类的实例，并尝试进行相互之间的赋值，以看看会发生什么。因为`Animal`与`Rhino`共享了来自`Animal`中的同一声明`private name: string`的它们形状的`private`侧，因此它们是相容的（Because `Animal` and `Rhino` share the `private` side of their shape from the same declaration of `private name: string` in `Animal`, they are compatible）。但对于`Employee`却不是这样了。在尝试将一个`Employee`赋值给`Animal`时，就得到一个这些类型不相容的错误。就算`Employee`也有着一个名为`name`的`private`成员，但该成员也并不是那个在`Animal`中所声明的。

### 掌握`protected`

除了经由`protected`关键字声明的成员仍可以被派生类的实例所访问外，`protected`修改器（the `protected` modifier）与`private`修改器有着相似的行为。比如：

```typescript
class Person {
    protected name: string;

    constructor ( name: string ) { this.name = name; }
}

class Employee extends Person {
    private department: string;

    constructor ( name: string, department: string ) { 
        super(name);
        this.department = department;
    }
    
    public getElevatorPitch () {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee ("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name); // 报错： error TS2445: Property 'name' is protected and only accessible within class 'Person' and its subclasses.
```


