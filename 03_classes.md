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

## 关于只读修改器（Readonly modifier）

使用`readonly`关键字，可令到属性只读。只读的属性**必须在其声明处或构造函数里进行初始化**。

```typescript
class Octopus {
    readonly name: string;
    readonly numberOfLegs = 8;

    constructor (theName: string) {
        this.name = theName;
    }
}

let dad  = new Octopus ("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // 报错，`name` 是只读的。error TS2540: Cannot assign to 'name' because it is a constant or a read-only property.
```

### 参数式属性（Parameter properties）

上一个示例不得不在`Octopus`这个类中，声明一个只读成员`name`，以及一个构建器参数`theName`，且随后要立即将`name`设置为`theName`。这种做法被证明是一种十分常见的做法。通过*参数式属性（parameter properties）*可在一处就完成成员的创建与初始化。下面是使用参数式属性方法，对上一个`Octopus`类的更进一步修订：

```typescript
class Octopus {
    readonly numberOfLegs: number = 8;

    constructor (readonly: name: string) {}
}
```

请注意这里完全丢弃了`theName`，而仅使用构建器上简化的`readonly name: string`参数，进行`name`成员的创建与初始化。从而实现了将声明与赋值强固到一个地方。

参数式属性是通过在构造函数参数前，加上可访问性修改器（`public/private/protected`）或`readonly`，抑或同时加上可访问性修改器与`readonly`，得以声明的。对于一个声明并初始化私有成员的参数化属性，就使用`private`做前缀；对于`public`、`protected`及`readonly`亦然。


## 访问器（Accessors）

TypeScript支持以`getters/setters`方式，来拦截对某对象成员的访问。此特性赋予对各个对象成员的访问以一种更为精良的控制（TypeScript supports getters/setters as a way of intercepting accesses to a member of an object. This gives you a way of having finer-grained control over how a member is accessed on each object）。

下面将一个简单的类，转换成使用`get`及`set`的形式。首先，从没有获取器与设置器（getter and setter）开始：

```typescript
class Employee {
    fullName: string;
}

let employee = new Employee ();

employee.fullName = "Bob Smith";

if (employee.fullName) {
    console.log(employee.fullName);
}
```

尽管允许人为随机对`fullName`进行直接设置相当方便，但如果某人可以突发奇想地修改名字，那么这样做就可能带来麻烦（while allowing people to randomly set `fullName` directly is pretty handy, this might get us in trouble if people can change names on a whim）。

下面一版中，将在允许用户修改`employee`对象之前，先检查用户是否有一个可用的密码。这是通过把对`fullName`的直接访问，替换为一个将检查密码的`set`方法来实现的。同时还加入了一个相应的`get`方法，以允许这个示例可以无缝地继续工作。

```typescript
let passcode = "secret passcode";

class Employer {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode === "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthenticated update of employer!")
        }
    }
}

let employer = new Employer ();

employer.fullName = "Bob Smith";

if (employer.fullName) {
    console.log(employer.fullName);
}
```

为了证实这里的访问器有对密码进行检查，可修改一下那个密码，看看在其不匹配时，将得到警告没有更新`employer`权限的消息。

有关访问器需要注意以下几点：

首先，访问器特性要求将TypeScript编译器设置到输出为ECMAScript 5或更高版本。降级到ECMAScript 3是不支持的。其次，带有`get`却没有`set`的访问器，将自动推理到是`readonly`成员。这样做在从代码生成到`.d.ts`文件时是有帮助的，因为用到该属性的人可以明白他们不能修改该属性。


## 关于静态属性（Static Properties）

到目前为止，都讨论的是类的*实例（instance）*成员，这些成员都是在对象被实例化了后才出现在对象上的（Up to this point, we've only talked about the *instance* members of the class, those that show up on the object when it's instantiated）。其实还可以给类创建*静态（static）*成员，所谓静态成员，就是在类本身，而不是示例上可见的成员。下面的示例在`origin`上使用了`static`关键字，因为`origin`是所有`Grid`的通用值。各个实例通过在`origin`前加上该类的名字，来访问此值。与在访问实例时在前面加上`this.`类似，在访问静态成员时，前面加的是`Grid.`。

```typescript
class Grid {
    static origin = { x: 0, y: 0 };

    calculateDistanceFromOrigin ( point: { x: number, y: number } ) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);

        return Math.sqrt( xDist * xDist + yDist * yDist ) / this.scale;
    }

    constructor ( public scale: number ) {};
}

let grid1 = new Grid(1.0);
let grid2 = new Grid(2.0);

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

## 关于抽象类（Abstract Classes）

抽象类是一些可以派生出其它类的基类。抽象类不可以被直接实例化。与接口的不同之处在于，某个抽象类可以包含其成员实现的细节。抽象类及某个抽象类中的抽象方法的定义，是使用`abstract`关键字完成的（Unlike an interface, an abstract class may contain implementation details for its members. The `abstract` keyword is used to define abstract classes as well as abstract methods within an abstract class）。

```typescript
abstract class Animal {
    abstract makeSound(): void;

    move(): void {
        console.log("roaming the earth...");
    }
}
```

抽象类中被标记为`abstract`的方法，不包含其具体实现，而必须要在派生类中加以实现。抽象方法与接口方法有着类似的语法。二者都定义了不带有方法体的某个方法的签名。但抽象方法必须带有`abstract`关键字，同时可以包含访问修改器（Abstract methods share a similar syntax to interface methods. Both define the signature of a method without including a method body. However, abstract methods must include the `abstract` keyword and may optionally include access modifiers）。

```typescript
abstract class Department {
    constructor ( public name: string ) {}

    printName (): void {
        console.log("Department name: " + this.name);
    }

    abstract printMeeting (): void; // 在派生类中必须实现此方法
}

class AccountingDepartment extends Department {
    constructor () {
        super ("Accounting and Auditing"); // 派生类中的构建器必须调用 `super()` 方法
    }
    
    printMeeting (): void {
        console.log ("The Accounting Department meets each Monday @10am.");
    }

    generateReports (): void {
        console.log ("Generating accounting reports...");
    }
}

let department: Department; // 创建一个到抽象类型的引用是没有问题的 
department = new Department (); // 报错： 无法创建某个抽象类的实例 error TS2511: Cannot create an instance of the abstract class 'Department'.
department = new AccountingDepartment(); // 创建非抽象子类的实例并为其赋值，没有问题
department.printName();
department.printMeeting();
department.generateReports(); // 报错：该方法并不存在与所声明的抽象类型上 error TS2339: Property 'generateReports' does not exist on type 'Department'.
```

## 一些高级技巧（Advanced Techniques）

### 关于构建器函数

当在TypeScript中声明类的时候，实际上就是同时创建出了多个的声明。首先是该类的*实例（instance）*的类型。

```typescript
class Greeter {
    greeting: string;

    construtor (msg: string) {
        this.greeting = msg;
    }

    greet () {
        return `Hello, ${this.greeting}`;
    }
}

let greeter: Greeter;

greeter = new Greeter("World");
console.log(greeter.greet());
```

这里在说到`let greeter: Greeter`时，就使用了`Greeter`作为类`Greeter`的实例的类型。这对于那些其它面向对象语言的程序员来说，几乎是第二天性了（This is almost second nature to programmers from other object-oriented languages）。

同时还创建出名为`构造函数（construtor function）`的另一个值。这就是在使用`new`关键字，建立该类的实例时，所调用的那个函数。为搞清楚该函数实际面貌，请看看下面由以上示例所生成的JavaScript（ES6）：

```typescript
let Greeter = (function (){
    function Greeter (msg) {
        this.greeting = msg;
    }

    Greeter.prototype.greet = function () {
        return `Hello, ${this.greeting}`;
    }

    return Greeter;
})();

let greeter;

greeter = new Greeter("World")!
console.log(greeter.greet());
```

这里的`let Greeter`**即将**被该构造函数赋值（Here, `let Greeter` is going to be assigned (by) the construtor function）。在调用`new`并允许此函数时，就得到一个该类的实例。构造函数还包含了该类的所有静态成员（`greet()`）。还可以把各个类想成是有着一个*实例*端与*静态*端（Another way to think of each class is that there is an *instance* side and *static* side）。

下面对该示例稍加修改，来展示这种区别：

```typescript
class Greeter {
    static standardGreeting = "Hello, there";

    greeting: string;

    greet () {
        if (this.greeting) {
            return `Hello, ${this.greeting}`;
        }
        else {
            return Greeter.standardGreeting;
        }
    }
}

let greeter1 : Greeter;
greeter1 = new Greeter();
console.log (greeter1.greet());

let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey there!";

let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet());
```

本示例中，`greeter1`的运作与上面类似。对`Greeter`类进行了初始化，得到并使用了对象`greeter1`。这样所在前面有见过。

接下来就直接使用了类`Greeter`。于此创建了一个名为`greeterMaker`的新变量。此变量（注：实际上对应的内存单元）将保有类`Greeter`自身，换种说法就是类`Greeter`的构造函数（类实际上是构造函数？）。这里使用了`typeof Greeter`，从而达到“给我类`Greeter`本身的类型”，而非类示例类型的目的。或者更准确地说，“给我那个名叫`Greeter`符号的类型”，那就是`Greeter`类的构造函数的类型了。此类型将包含`Greeter`的所有静态成员，以及建立`Greeter`类实例的构造函数。后面通过在`greeterMaker`上使用`new`关键字，创建`Greeter`的新实例，并如之前那样运行它们，就就证实了这一点。


### 将类用作接口（Using a class as an interface）

正如上一小节所说，一个类的声明，创建出两个东西：该类实例的类型，以及构造函数（a class declaration creates two things: a type representing instances of the class and a constructor function）。因为类创建了类型，所以就可以在那些可使用接口地方使用类。

```typescript
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };
```
