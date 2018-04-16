# 迭代器与生成器

**Iterators and Generators**

## 可迭代对象（Iterables）

在对象有着`Symbol.iterator`属性时，其就被认为是可迭代的。一些内建类型，比如`Array`、`Map`、`Set`、`String`、`Int32Array`、`Uint32Array`等，都已经有着其已实现的`Symbol.iterator`属性。对象上的`Symbol.iterator`函数，赋值返回要迭代的值的清单（`Symbol.iterator` function on an object is responsible for returning the list of values to iterate on）。

### `for..of`语句

`for..of`对可迭代对象进行循环，调用对象上的`Symbol.iterator`属性。下面是一个在数组上的简单`for..of`循环：

```typescript
let someArray = [1, "string", false];

for (let entry of someArray){
    console.log(entry); // 1, "string", false
}
```

### `for..of`与`for..in`语句

`for..of`与`for..in`语句都是对清单进行迭代；但所迭代的值却是不同的，`for..in`返回的是所迭代对象的 *键* 的清单，而`for..of`则是返回的所迭代对象数值属性的 *值* 的清单（Both `for..of` and `for..in` statements iterate over lists; the values iterated on are differenct though, `for..in` returns a list of *keys* on the object being iterated, whereas `for..of` returns a list of *values* of the numeric properties of the object being interatd）。

```typescript
let list = [4, 5, 6];

for (let i in list) {
    console.log(i); // "0", "1", "2"
}
