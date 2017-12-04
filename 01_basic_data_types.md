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

> 与Python中清单的比较： Python清单中的元素，不要求类型一致，且因此认为Python在数据结构上更具灵活性。Python清单有`pop()`、`append()`等方法，TypeScript要求数组元素类型一致（比如强行将不一致的元素push到数组上，其编译器就会报错），则有`push()`与`pop()`方法。它们都是使用`[]`符号。


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

在访问某个索引已知的元素时，将得到正确的类型：

```typescript
console.log(x[0].substr(1)); // 没有问题
console.log(x[1].substr(1)); // 报错，'number' does not have 'substr'
```

在访问元组的越界元素时，将使用**联合类型**（Union Types，属于高级类型(Advanced Types)的一种）进行替代：

```typescript
x[3] = 'fat'; // 没有问题，字符串可以赋值给（`string` | `number`）类型

console.log(x[5].toString()); // 没有问题，`string` 与 `number` 都有 toString 方法

x[6] = true; // 报错，布尔值不是（`string` | `number`）类型 (error TS2322: Type 'true' is not assignable to type 'string | number'.)
```

> 与Python元组的比较：Python元组是不可修改的，访问速度较快。Python元组与Python清单一样可以包含不同类型的元素。Python元组使用`()`符号。

## 枚举（`enum`）

`enum`是TypeScript引入的新特性，作为JavaScript标准数据类型的补充。与像C#等其它语言一样，枚举类型的使用，可以为某组数值带来更加友好的名字。

```typescript
enum Color {Red, Green, Blue};
let c: Color = Color.Green;
```

枚举中的元素编号默认从`0`开始。也可手动指定元素编号数值。比如：

```typescript
enum Color {Red=1, Green, Blue};
let c: Color = Color.Green;
```

或者全部采用手动的编号：

```typescript
enum Color {Red = 1, Green = 2, Blue = 4};
let c: Color = Color.Green;
```

使用枚举特性的一个好处，在于可经由枚举类型变量的值，获取到其对应的名字。比如：

```typescript
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

console.log(colorName); // 将输出`Green`，因为上面的代码中`Green`的值为2
```

> 枚举的深入理解：通过使用枚举特性，可以创建出定制的名称（字符串）-值（整数）映射的类型，随后就可以利用创建出的定制类型，来声明变量，从而加以使用。

## 任意值 （`any`）

在编程阶段，可能会为那些尚不能确定类型的变量，指定一个类型。比如那些来自用户输入、第三方库等的动态内容的值所对应的变量。此种情况下，就不希望TypeScript的类型检查器，对这些值进行检查，而是让它们直接通过编译阶段的检查。那么，就可以使用`any`类型来标记这些变量：

```typescript
let notSure: any = 4;
notSure = 'Maybe a string instead';
notSure = false; // 布尔值也没有问题
```

在对既有代码进行改写的时候，`any`类型就十分有用。`any`类型的使用，令到在编译时选择性的通过或跳过类型检查。你可能会认为与其它语言中也一样，`Object`类型也具有同样的作用。但`Object`类型的变量只是允许被赋予任意值，却不能在上面调用任意的方法，即使其真的有着这些方法：

```typescript
let notSure: any = 4;
notSure.ifItExists(); // 没有问题，因为在运行时可能存在这个一个`ifItExists`方法
notSure.toFixed(); // 没有问题，因为`toFixed`方法确实存在（但编译器是不会加以检查的）

let prettySure: Object = 4;
prettySure.toFixed(); // 报错，类型`Object`上没有`toFixed`属性 （error TS2339: Property 'toFixed' does not exist on type 'Object'.）
```

就算只知道一部分数据的类型，`any`类型也是有用的。比如，有这么一个元组（数组？），其包含了不同类型的数据：

```typescript
let list: any[] = [1, true, "free"];
list[1] = 100;
```

## 空值（`void`）

从某种角度看来，`void`恰恰是与`any`相反的类型，它表示没有任何类型。当某个函数没有返回值时，通常会看到其返回值类型为`void`：

```
function warnUser(): void {
    alert('This is my warning message!');
}
```

仅仅声明一个`void`类型的变量是毫无意义的，因为只能为其赋予`undefined`和`null`值：

```typescript
let unusable: void = undefined;
```

> 那么`void` 类型，也就仅作为函数返回值类型了。

## `null` 与 `undefined`

TypeScript中的值`undefined`与`null`都有各自的类型，分别叫`undefined`与`null`。它们与`void`类似，各自用处都不大：

```typescript
let u: undefined = undefined;
let n: null = null;
```

默认所有其它类型，都用着子类型`undefined`与`null`。也就是说，可将`null`与`undefined`赋值给`number`、`string`、`list`、`tuple`、`void`等类型。

但在指定了编译器（tsc, typescript compiler）选项`--strictNullChecks`时，`null`与`undefined`就只能赋值给`void`以及它们自己了。这能避免**很多**常见的问题。比如在某处计划传入一个`string`或`null`或`undefined`的参数，那么就可使用`string | null | undefined`的**联合类型**。

> 注意：TypeScript最佳实践是开启`--strictNullChecks`选项，但现阶段假设此选项是关闭的。


## `never`类型

类型`never`表示一些永不存在的值的类型。比如，可将那些总是会抛出异常，或根本不会有返回值的函数表达式、箭头函数表达式的返回值设置为`never`类型；一些变量也可以是`never`类型，仅当它们受永不为真的**类型保护**约束时。

以下是一些返回`never`类型的函数：

```typescript
// 返回`never`的函数，必须存在无法到达的终点（return?）
function error(message: string): never {
    throw new Error (message);
}

// 推断的返回值类型为never
function fail () {
    return error('Somthing failed')
}

// 返回`never`的函数，必须存在无法到达的终点

function infiniteLoop (): never {
    while(true) {
    
    }
}
```

## 类型的断言（Type Assertion）

可能会遇到这样的情况，相比TypeScript（编译器），Coder更有把握了解某个值的类型。也就是说Coder清楚地了解某个实体（entity, 与变量名称所对应的内存单元）有着比它现有类型（`any`/`undefined`/`null`等）更具体的类型。

那么此时就可以通过**类型断言**，告诉编译器“相信我，我知道自己在干什么”，从而对编译进行干预。类型断言相当于其它语言中的类型转换，只是不进行特殊的数据检查与结构（destructure）。其对运行时没有影响，尽在编译阶段起作用。TypeScript会假设Coder已进行了必要的检查。

```typescript
let someValue: any = "This is a string";
let strLength: number = (<string>someValue).length;
```

类型断言的另一个`as`的写法：

```typescript
let someValue: any = "This is a string";
let strLength: number = (someValue as string).length;
```

这两种形式是等价的。使用何种写法，仅凭个人喜好；但在结合JSX（[https://jsx.github.io/](https://jsx.github.io/)）使用TypeScript时，就只能用`as`的写法。

## 深入理解`let`

在上面的示例中，TypeScript的`let`关键字取代了JavaScript中的`var`关键字。JavaScript版本ES6（ECMAScript 2015）带来了新的`let`关键字，TypeScript进行了实现。Javascript原来的很多问题，都可以通过使用`let`加以解决，所以尽可能的使用`let`来代替`var`了。
