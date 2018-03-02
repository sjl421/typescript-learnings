# 枚举（Enums）

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

### 字符串枚举（String enums）

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

### 异质枚举（Heterogeneous enums）

技术上枚举是可以混合字符串与数字成员的，但这么做似乎没有什么理由：

```typescript
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```

除非要以某种明智的方式来利用JavaScript的运行时行为，否则建议不要这样做。

### 计算的与常量成员（Computed and constant members）


