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
