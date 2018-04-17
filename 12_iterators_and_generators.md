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

for (let i of list) {
    console.log(i); // "4", "5", "6"
}
```

另一个区别就是`for..in`在任何对象上均可执行；它提供了一种探测对象上属性的方法。而`for..of`则主要关注的是可迭代对象的值。诸如`Map`及`Set`等实现了`Symbol.iterator`属性的内建对象，才允许对存储值的访问（Built-in objects like `Map` and `Set` implement `Symbol.iterator` property allowing access to stored values）。

```typescript
let pets = new Set(["Cat", "Dog", "Hamster"]);

pets["species"] = "mammals";

for (let pet in pets) {
    console.log(pet); // "species"
}

for (let pet of pets) {
    console.log(pet); // "Cat", "Dog", "Hamster"
}
```

## 关于代码生成（Code generation）

### 目标代码为ES5及ES3

在生成目标代码为ES5或ES3时，只允许在`Array`类型上使用迭代器。就算非数组值实现了`Symbol.iterator`属性, 在它们上使用`for..of`循环都是错误的。

编译器将为`for..of`循环生成一个简单的`for`循环，例如：

```typescript
let numbers = [1, 2, 3];

for (let num of numbers) {
    console.log(num);
}
```

将生成如下代码：

```javascript
var numbers = [1, 2, 3];

for (var _i = 0; _i < numbers.length; _i++) {
    var num = numbers[_i];
    console.log(_i);
}
```

### 目标代码为ECMAScript2015或更高版本时

在以兼容ECMAScript2015引擎为目标时，编译器将生成`for..of`循环，从而以引擎中的内建迭代器实现为目标。
