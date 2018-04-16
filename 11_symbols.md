# 符号

**Symbols**

## 简介

从ECMAScript 2015开始，与`number`和`string`一样，`symbol`就是一种原生数据类型了。

`symbol`值的创建，是通过调用`Symbol`构造器完成的。

```typescript
let sym1 = Symbol();
let sym2 = Symbol("key"); // “key”是可选字符串
```

符号是不可修改的，且具独特性。

```typescript
let sym2 = Symbol("key");
let sym3 = Symbol("key");

sym2 === sym3; // `false`，因为符号是独特的
```

与字符串一样，符号可作为对象属性的键来使用。

```typescript
let sym = Symbol();

let obj = {
    [sym]: "value"
};

console.log(obj[sym]); // "value"
```

符号也可与 **计算属性声明** 一起，来声明对象属性与类成员（Symbols can also be combined with **computed property declarations** to declare object properties and class members）。

```typescript
const getClassNameSymbol = Symbol();

class C {
    [getClassNameSymbol](){
        return "C";
    }
}

let c = new C();
let className = c[getClassNameSymbol](); // "C"
```

## 一些熟知的符号（Well-known Symbols）

出来用户定义的符号外，还有一些内建熟知的符号。内建的符号，用于表示内部的语言行为（In addition to user-defined symbols, there are Well-known built-in symbols. Built-in symbols are used to represent internal language behaviors）。

下面是一个熟知符号的清单。

### `Symbol.hasInstance`

判断构造器对象是否将某个对象识别为该构造器的一个实例的方法。由`instanceof`运算符的语义调用（A method that determines if a constructor object recognizes an object as one of the constructor's insstance. Called by the semantics of the `instanceof` operator）。

### `symbol.isConcatSpreadable`

一个表明某对象应通过`Array.prototype.concat`被扁平化到其数组元素的逻辑值（A Boolean value indicating taht an object should be flattened to its array elements by `Array.prototype.concat`）。

### `Symbol.iterator`

返回某对象默认迭代器的方法。由`for .. of`语句的语义调用（A method that returns the default iterator for an object. Called by the semantics of the `for .. in` statement）。

### `Symbol.match`

一个对正则表达式与字符串进行匹配的正则表达式函数。由`String.prototype.match`方法进行调用（A regular expression method that matches the regular expression against a string. Called by the `String.prototype.match` method）。

### `Symbol.replace`

一个对字符串中匹配的子字符串进行匹配的正则表达式函数。由`String.prototype.replace`方法进行调用（A regular expression method that replaces matched substring of a string. Called by the `String.prototype.replace` method）。

### `Symbol.search`

一个返回与正则表达式匹配的某字符串中索引的正则表达式函数。由`String.prototype.search`方法调用（A regular expression method that returns the index within a string that matches the regular expression. Called by the `String.prototype.search` method）。

### `Symbol.species`

一个用于创建派生对象的函数值属性，也就是构造函数（A function valued property that is the constructor function that is used to create derived objects）。

### `Symbol.split`

一个在与给出的正则表达式匹配的索引出对字符串进行分割的正则表达式函数。由`String.prototype.split`方法进行调用（A regular expression method that splits a string at the indices that match the regular expression. Called by the `String.prototype.split` method）。

### `Symbol.toPrimitive`

一个将对象转换到相应的原生值的方法。由`ToPrimitive`抽象操作进行调用（A method that converts an object to a corresponding primitive value. Called by the `ToPrimitive` abstract operation）。

### `Symbol.toStringTag`

一个在对象默认字符串说明的创建中用到的字符串值。由内建的`Object.prototype.toString`方法调用（A string value that is used in the creation of the default string description of an object. Called by the built-in method `Object.prototype.toString`）。

### `Symbol.unscopables`

一个其自身属性名称是那些排除在相关对象的`with`环境绑定之外的属性名称的对象（An `Object` whose own property names are property names excluded from the `with` environment bindings of the associated objects）。
