# 枚举（Enums）

Enum [en^m]是源自Enumerate, 意思是一一列举出来。

枚举特性令到定义一个命名常量的集合可行。使用枚举可使得意图表达，或创建差异案例更为容易（Using enums can make it easier to document intent, or create a set of distinct cases）。TypeScript同时支持基于数字与字符串这两种枚举。

## 数字的枚举（Numeric enums）

这里将首先以数字枚举开始，如有着其它语言的经验，那么这种枚举可能更为熟悉。使用`enum`关键字，就可以定义出一个枚举。

```typescript
enum Direction {
    Up = 1,
    Down,
    Left,
    Right,
}
```

上面的示例有着一个数字的枚举，其中`Up`以`1`进行了初始化。其后的所有成员，都被从那个点自动增加。也就是说，`Direction.Up`的值为`1`，`Down`为`2`，`Left`为`3`，`Right`为`4`。

如有需要，亦可将初始值完全留空：

```typescript
enum Direction {
    Up,
    Down,
    Left,
    Right,
}
```

此时，`Up`的值将为`0`，`Down`将为`1`，等等。对于那些不会考虑成员值本身的案例，这种自动增加的行为是有用的，不过无需担心在同一枚举中各个值与其它值是各异的。

使用枚举很简单：只要以枚举本身属性的方式，并使用枚举的名称来声明类型，来访问其任何成员即可（Using an enum is simple: just access any member as a property off of the enum itself, and declare types using the name of the enum）。

```typescript
enum Response {
    No = 0,
    Yes,
}

function respond (recipient: string, message: Response): void {
    // ...
}

respond ("Princess Caroline", Response.Yes);
```

数字枚举可混合计算的与常量成员（见后）。简单的说，没有初始值的枚举成员，要么需放在第一个，或必须在那些以数值常量或其它常量枚举成员初始化过的数字枚举成员之后（Numberic enums can be mixed in computed and constant members(see below). The short story is, enums without initializers either need to be first, or have to come after numberic enums initialized with numberic constants or other constant enum members）。也就是说，下面这种方式是不允许的：

```typescript
enum E {
    A = getSomeValue (),
    B, // Enum member must have initializer. (1061)
}
```

## 字符串枚举（String enums）

字符串枚举的概念相同，但有一些细微的运行时上的不同（runtime differences），后面会有说明。在字符串枚举中，每个成员都必须使用字符串字面值，或其它字符串枚举成员加以初始化。

```typescript
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```

虽然字符串枚举不具有自动增加行为，它们却仍然受益于其良好的“连续性”。换句话说，加入正在对程序进行调试，而不得不读取某个数字枚举的运行时值，该值通常是不透明的 -- 该值并不能提供到任何其本身有用的意义（尽管反向映射通常有所帮助），但字符串枚举却允许在代码运行时，独立于枚举成员本身，赋予有意义且可读的值（While string enums don't have auto-incrementing behavior, string enums have the benefit that they "serialize" well. In other words, if you are debugging and had to read the runtime value of a numeric enum, the value is ofter opaque - it doesn't convey any useful meaning on its own(though reverse mapping can often help), string enums allow you to give a meaningful and readable value when your code runs, independent of the name of the enum member itself）。

## 异质枚举（Heterogeneous enums）

技术上枚举是可以混合字符串与数字成员的，但这么做似乎没有什么理由：

```typescript
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```

除非要以某种明智的方式来利用JavaScript的运行时行为，否则建议不要这样做（Unless you're really trying to take advantage of JavaScript's runtime behavior in a clever way, it's advised that you don't do this）。


## 计算的与常量成员（Computed and constant members）

枚举的每个成员，都有着一个与其关联的值，该值可以是 *常量或计算值(constant or computed)*。在以下情况下，枚举成员将被看着是常量：

- 其作为枚举中的第一个成员且没有初始值，这种情况下其就被赋予值`0`：

    ```typescript
    // E.X 是常量
    enum E { X }
    ```

- 没有初始值，且前一个枚举成员是一个 *数字* 常量。这种情况下当前枚举成员的值将是其前一个枚举成员加一。

    ```typescript
    // `E1`与`E2`中的所有枚举成员都是常量。
    enum E1 { X, Y, Z }
    enum E2 { A = 1, B, C }
    ```

+ 以常量枚举表达式（a constant enum expression）初始化的成员。常量枚举表达式是TypeScript表达式的一个子集，在运行时可被完整执行。在满足以下条件是，表达式就是常量枚举表达式：
    1. 字面的枚举表达式（基本的字符串表达式或数字表达式, a literal enum expression(basically a string literal or a numeric literal)）
    2. 对先前定义的常量枚举成员（可以来自不同枚举）的引用 （a reference to previously defined constant enum member(which can originate from a different enum)）
    3. 一个用括号包围的常量枚举表达式（a parentthesized constant enum expression）
    4. 运用到常量枚举表达式的`+`、`-`及`~`三个一元运算符之一（one of the `+`, `-`, `~` unary operators applied to constant enum expression）
    5. 与将常量枚举表达式作为操作数一起的`+`、`-`、`*`、`/`、`%`、`>>`、`<<`、`>>>`、`&`、`|`、`^`等二元运算符

对于结果为`NaN`（Not a Number, 非数值）或`Infinity`（无穷），将作为编译时错误加以对待（It is compile time error for constant enum expressions to be evaluated to `NaN` or `Infinity`）。

那么其它所有情况下，枚举成员都将被看作是计算的（In all other cases enum member is considered computed）。

```typescript
enum FileAccess {
    // 常量成员
    None,
    Read        = 1 << 1,
    Write       = 1 << 2,
    ReadWrite   = Read | Write,
    // 计算的成员
    G = "123".length,
}
```

## 联合枚举与枚举成员类型（Union enums and enum member types）

存在这么一个非计算的常量枚举成员的特殊子集： **字面的枚举成员**。字面枚举成员是不带有初始值的，或有着被初始化为以下值的常量枚举成员（There is a special subset of constant enum members that aren't calculated: literal enum members. **A literal enum member** is a constant enum member with no initialized value, or with values that are initialized to）:

- 任意字符串字面值（比如`"foo"`、`"bar"`、`"baz"`）
- 任意数字的字面值（比如`1`、`100`）
- 应用到任意数字字面值的一元减号运算符（比如`-1`、`-100`）

在某个枚举中所有成员都有着字面枚举值时，某些特别的语法就会生效。

第一就是枚举成员还成为了类型！比如，这里可以说某些成员 *只* 能具有某个枚举成员的值（The first is that enum members also become types as well! For example, we can say that certain members can *only* have the value of an enum member）:

```typescript
enum ShapeKind {
    Circle,
    Square,
}

interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

let c: Circle = {
    kind: ShapeKind.Square,
    // Type '{ kind: ShapeKind.Square; radius: number; }' is not assignable to type 'Circle'.
    //  Types of property 'kind' are incompatible.
    // Type 'ShapeKind.Square' is not assignable to type 'ShapeKind.Circle'. (2322)
    radius: 100,
}
```

另一改变，就是枚举类型本身，有效地成为各枚举成员的 *联合* 。虽然到这里还没有讨论到 **联合类型** （**union types**），只需知道有了联合枚举，TypeScript的类型系统，就能够利用其对存在于枚举本身中的那些确切值的知悉这一事实。而正由于这一点，TypeScript就能捕捉到那些可能进行不正确地值比较等愚蠢程序错误（The other change is that enum types themselves effectively become a *union* of each enum member. While we havn't discussed **union types** yet, all that you need to know is that with union enums, the type system is able to leverage the fact that it knows the exact set of values that exist in the enum itself. Because of that, TypeScript can catch silly bugs where we might be comparing values incorrectly）。比如：

```typescript
enum E {
    Foo,
    Bar,
}

function f (x: E) {
    if ( x !== E.Foo || x !== E.Bar ) {
        // ~~~~~~~~~~
        // Operator '!==' cannot be applied to types 'E.Foo' and 'E.Bar'. (2365)
    }
}
```

在该示例中，首先检查了`x`是否不是`E.Foo`。如此检查成功，那么这里的`||`将短路，同时`if`的语句体将得到运行。但是若那个检查不成功，那么`x`就只能是`E.Foo`，因此再来判断其是否等于`E.Bar`就没有意义了（In that example, we first checked whether `x` was *not* `E.Foo`. If that check succeeds, then our `||` will *short-circuit*, and the body of the `if` will get run. However, if the check didn't succed, then `x` can *only* be `E.Foo`, so it doesn't make sense to see whether it's equal to `E.Bar`）。

## 运行时的枚举（Enums at runtime）

运行时存在的枚举，都是真实的对象。比如，下面的这个枚举：

```typescript
enum E {
    X, Y, Z
}
```

就能被确切地传递给函数：

```typescript
function f(obj: { X: number }) {
    return obj.X;
}

f(E);
```

## 反向映射（Reverse mappings）

除了创建出一个带有属性名称成员的对象之外，数字枚举成员，还可以得到一个枚举值到枚举名称的 *反向映射* （In addition to creating an object with property names for members, numeric enums members also get a *reverse mapping* from enum values to enum names）。比如，在下面的示例中：

```typescript
enum Enum {
    A
}

let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

TypeScript 会将此编译到类似下面的JavaScript代码：

```javascript
var Enum;
(function (Enum) {
    Enum[Enum["A"] = 0] = "A";
})( Enum || (Enum = {}) );

var a = Enum.A;
var nameOfA = Enum[a]; // "A"
```

在生成的代码中，枚举就被编译成一个同时存储了正向（`name` -> `value`）与逆向（`value` -> `name`）映射的对象中。对其它枚举成员的引用，总是作为属性访问而被省略，且绝不会被内联
