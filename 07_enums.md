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


