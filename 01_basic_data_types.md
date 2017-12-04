# TypeScript基础数据类型

## 布尔值

`true/false`, JavaScript与TypeScript中叫做`boolean`（其它语言也一样）。

```typescript
let isDone: boolean = false;
```


## 数字

与JavaScript一样，TypeScript中的**所有数字，都是浮点数**，类型为`number`。TypeScript支持十进制、十六进制字面量（literal），还有ECMAScript 2015中引入的二进制与八进制字面量。

```typescript
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

## 字符串

基于NodeJS的JavaScript服务端框架，或者众多的客户端框架，它们能够可处理客户端或服务器端的文本数据。与其它语言一样，TypeScript使用`string`来表示文本数据类型。与JavaScript一样，可使用`"`（双引号）或`'`（单引号）来表示字符串。

```typescript
let name: string = 'Bob';
name = "Smith";
```

此外，TypeScript或ES6中，还可以使用*模板字符串（template string）*，它可以**定义多行文本**与**内嵌表达式**。

```typescript
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.

I'll be ${ age+1 } years old next month`;
```

这与下面定义`sentence`的方式，有相同效果：

```javascript
let sentence: string = "Hello, my name is " + name + ".\n\n" +
"I'll be " + ( age+1 ) + "years old next month.";
```

## 数组

和JavaScript一样，TypeScript可以操作数组元素。定义数组的方式有两种，一是可以在类型后面接上`[]`，表示由此类型元素所组成的一个数组：

```typescript
let list: number[] = [1, 2, 3, 4];
```

第二种方式，是使用**数组泛型（Array Generic）**，`Array<type>`：

```typescript
let list: Array<number> = [1, 2, 3, 4];
```

> 与Python中清单的比较： Python清单中的元素，不要求类型一致，且因此认为Python在数据结构上更具灵活性。Python清单有`pop()`、`append()`等方法，TypeScript要求数组元素类型以致（比如强行将不一致的元素push到数组上，其编译器就会报错），则有`push()`与`pop()`方法


## 元组（Tuple）

TypeScript中的元组，允许表示一个**已知元素数量与类型**的数组，这些元素的类型不要求一致。比如，可定义一对值分别为`string`与`number`类型的元组。

```typescript
// 声明一个元组类型
let x: [string, number];

// 对其进行初始化
x = ['weight', 181];

// 错误的初始化
x = [181, 'weight'];
```

