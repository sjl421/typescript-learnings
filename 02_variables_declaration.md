# 变量的声明，Variables Declaration

`let`与`const`是较新一版JavaScript(ES6)中变量声明的方式。前一部分提到，`let`在很多方面与`var`是相似的，单`let`却可以帮助大家解决JavaScript中的一些常见问题。`const`是对`let`的一个增强，可阻止对经其修饰的变量的再次赋值。

因为TypeScript是JavaScript的超集(super-set)，所以自然有对JavaScript所有特性的支持，`let`与`const`关键字也不例外。以下将详细讨论这些全新的声明方式，以及为何要用它们来取代`var`的原因。

如果你还没有发现JavaScript中使用`var`所带来的问题，那么下面的内容将唤起你的记忆。

## 关于`var`式变量声明

JavaScript使用`var`关键字来声明变量，有着悠久的历史：

```javascript
var a = 10;
```

显而易见，这里定义出一个名为`a`的值为`10`的变量（指向某个内存单元地址）。

在函数内部，也可以进行变量的定义：

```javascript
function f() {
    var msg = "Hello, World!"

    return msg;
}
```

在其它函数内部，也可以访问相同变量：

```javascript
function f() {
    var a = 10;

    return function g() {
        var b = a+1;
        return b;
    }
}

var g = f();
g();
```

在上面的例子中，`g` 可以获取到函数`f`里定义的变量`a`。在`g`被调用时，它都可以访问到`f`里的变量`a`。*即使`g`在`f`已经执行完毕后才被调用，其任可以访问并对`a`进行修改*。

```javascript
function f () {
    var a = 1;

    a = 2;

    var b = g();

    a = 3;

    return b;

    function g () {
        return a;
    }
}

f(); // 返回的是 2
```

## 作用域规则（Scope Rules）

加入对其它严格的编程语言比较熟悉，那么对于JavaScript中`var`声明的作用域规则，将感到奇怪。比如：

```typescript
function f(shouldInitialize: boolean) {
    if ( shouldInitialize ) {
        var x = 10;
    } 

    return x;
}

f(true); // 返回的是 `10`
f(false); // 返回 `undefined`
```

多看几遍这段代码就会发现，这里的变量`x`是定义在`if`语句里的，但却可以在该语句外面访问到它。究其原因，在于`var`声明可以在包含它的函数、模块、命名空间或全局作用域内的任何位置被访问到（后面将详细讨论这个问题），而所包含其的代码块却没什么影响。有人就直接叫这种作用域为**var作用域**，或**函数作用域**。对于函数参数，也适用函数作用域（函数参数也相当于`var`声明）。

此规则所涵盖到的作用域，将引发一些错误。比如多次声明同一个变量不会报错，就是其中之一：

```typescript
function sumMatrix (matrix: number[][]) {
    var sum = 0;

    for (var i = 0; i < matrix.length; i++){
        var currentRow = matrix[i];

        for (var i = 0; i < currentRow.length; i++){
            sum += currentRow[i];
        }
    }
    
    return sum;
}
```

显然，内层的`for`循环会覆盖变量`i`，因为所有`i`都引用相同的函数作用域内的变量。稍微有经验的Coder都知道，这些问题可能在代码审查时遗漏，从而引发麻烦。

## 捕获变量怪异之处

看看下面的代码，将有什么样的输出：

```javascript
for (var i = 0; i < 10; i++){
    setTimeout(function (){
        console.log(i);
    }, 100 * i);
}
```

这里的`setTimeout`会在若干毫秒的延时后执行一个函数（等待其它代码执行完毕）。

结果就是：

```sh
10
10
10
10
10
10
10
10
10
10
```

有经验的JavaScript程序员对此已经很熟悉了，但如果不能理解，也不是一个人。大多数人都期望得到这样的结果：

```bash
0
1
2
3
4
5
6
7
8
9
```

参考上面提到的捕获变量（Capturing Variables），传递给`setTimeout`的每一个函数表达式，实际上都引用了相同作用域中的同一个`i`。

`setTimeout`在若干毫秒后执行一个函数，而且是在`for`循环结束后。在`for`循环结束后，`i`的值就成为`10`。这就是作为`setTimeout`的第一个参数的函数在调用时，每次都输出`10`的原因。

作为解决此问题的一种方法，就是使用立即执行的函数表达式（Immediately Invoked Function Expression, IIFE, [参考链接](https://segmentfault.com/a/1190000003985390)）。

```javascript
for (var i = 0; i < 10; i++){
    // 这里要捕获到变量`i`的当前状态
    // 是通过触发带有其当前值的一个函数实现的
    (function(i){ 
        setTimeout(function (){
            console.log(i);
        }, 100 * i)
    })(i);
}
```

其实对于这种奇怪的形式，我们都已司空见惯了。立即执行函数中的参数`i`，会覆盖`for`循环中的`i`，但因为使用相同的名称`i`，所以都不用怎么修改`for`循环体内部的代码。

## 关于全新的`let`声明方式

现在已经知道使用`var`存在诸多问题，这也是要使用`let`的理由。除了拼写不一样外，`let`与`var`的写法一致。

```typescript
let hello = 'Hello!';
```

二者主要的区别，不在于语法上，而是语义的不同，下面会深入研究。

### 块作用域（Block Scoping）

在使用`let`来声明某个变量时，使用了*词法作用域（Lexical Scope）*，或*块作用域（Block Scope）*。与使用`var`声明的变量可在所包含的函数外部访问到不同，块作用域的变量在包含它们的块或`for`循环之外，是不能访问的。

```typescript
function f (input: boolean) {
    let a = 100;

    if (input) {
        // 这里仍然可以对`a`进行引用
        let b = a + 1;
        return b;
    }

    // 这样写就会报错：`b` 在这里不存在（error TS2304: Cannot find name 'b'.）
    return b;
}
```

上面的代码中定义了两个变量`a`和`b`。`a`的作用域是函数体`f`内部。而`b`的作用域为`if`语句块里。

在`catch`语句里声明的变量也具有同样的作用域规则。比如：

```typescript
try {
    throw "oh no!"
}

catch (e) {
    console.log("Oh well.")
}

// 下面这样会报错：这里不存在`e`
console.log(e);
```

块级作用域变量的另一个特点，就是在其被声明之前，是不能访问的（尚未分配内存？）。虽然它们始终“存在”与它们所属的作用域里，但在声明它们的代码之前的部分，被成为*暂时性死区（Temporal Dead Zone, TDZ）*（[参考链接](https://github.com/luqin/exploring-es6-cn/blob/master/md/9.4.md)）。暂时性死区只是用来说明不能在变量的`let`语句之前，访问该变量，而TypeScript编译器可以给出这些信息。

```typescript
a++; // error TS2448: Block-scoped variable 'a' used before its declaration. error TS2532: Object is possibly 'undefined'.
let a;
```

这里需要注意一点，在一个拥有块作用域的变量被声明之前，仍然可以*获取（capture）*到它。但要在变量被声明前就去调用那个其所属的函数，是不可行的。如编译目标代码是ECMAScript 2015（ES6），那么较新的运行时将抛出一个错误；不过目前的TypeScript编译器尚不能就此进行报错。

```typescript
function foo () {
    // 这里要获取到`a`没有问题（okay to capture `a`）

    return a;
}


// 但不能在`a`被声明前调用函数`foo`
// 运行时（runtime）应该抛出错误

foo();

let a;
```

关于*暂时性死区*的更多信息，请参考[Mozilla开发者网络](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone_and_errors_with_let)。


## 重定义与屏蔽（Re-decalration and Shadowing）

在使用`var`进行变量声明时，注意到对变量进行多少次声明都没有关系；得到的变量仅有一个。

```javascript
function f (x) {
    var x;
    var x;

    if (true) {
        var x;
    }
}
```

在上面的示例中，对`x`的所有声明，都是对同一个`x`的引用，且这样做也毫无问题。但这种做法通常将导致很多bug。`let`式的声明，终于不会这样任性了。

```typescript
let x = 10;
let x = 20; // error TS2451: Cannot redeclare block-scoped variable 'x'.
```

并不是要重复声明的变量，都是块作用域，TypeScript编译器才会给出存在问题的信息。

```typescript
function f (x) {
    let x = 100; // error TS2300: Duplicate identifier 'x'.
}

function g () {
    let x = 100;
    var x = 100; // error TS2451: Cannot redeclare block-scoped variable 'x'.
}
```

这并非是说块作用域的变量决不能以某个函数作用域变量加以声明。而是说块作用域变量，只需要在某个明显不同的块中，加以声明。

```typescript
function f(condition, x) {
    if (condition) {
        let x = 100;
        return x;
    }

    return x;
}

f(false, 0); // 返回 `0`
f(true, 0); // 返回 `100`
```

这种在某个更深的嵌套块中引入新变量名的做法，就叫*屏蔽（shadowing）*。这样做看起来像是双刃剑，因为无意的屏蔽可能引入某些程序漏洞，同时也可能防止某些漏洞。比如，设想用现在的`let`变量来重写之前的`sumMatrix`。

```typescript
function sumMatrix(matrix: number[][]) {
    let sum = 0;

    for (let i = 0; i < matrix.length; i++){
        var currentRow = matrix[i];

        for (let i = 0; i < currentRow.length; i++){
            sum += currentRow[i];
        }
    }
}
```

此版本的循环无疑将正确进行求和了，因为内层循环的`i`屏蔽了外层循环的`i`。

通常为了顾及编写出清爽的代码，应避免使用屏蔽（shadowing）。但在某些情况下使用屏蔽又能带来好处，因此用不用此特性就取决于你的判断了。

### 捕获块作用域变量（Block-scoped Variable Capturing）

前面在`var`式声明上，初次接触到**变量捕获（variable capturing）**这一概念，主要对所捕获到的变量的行为，有所了解。为了对此有更直观的认识，那么就说在某个作用域运行时，该作用域就创建出一个变量的“环境”。此环境及其所捕获到的变量，就算其作用域中的所有语句执行完毕，也仍将持续存在。

```typescript
function theCityThatAlwaysSleeps () {
    let getCity;

    if (true) {
        let city = "Seattle";

        getCity = function () {
            return city;
        }
    }

    return getCity;
}
```

上面的代码中，因为在`city`所在的环境中对其进行了捕获，所以尽管`if`块完成了执行，却仍可以访问到它。

回顾之前的`setTimeout`示例，那里为了捕获`for`循环的每次迭代下某个变量的状态，而最终使用了一个IIFE。实际上为了所捕获的变量，而是建立了一个新的变量环境。那样做有点痛苦，但幸运的是，在TypeScript中再也无须那样做了。

在作为某个循环一部分使用`let`进行变量声明时，这些`let`声明有着显著不同的行为。与仅仅将一个新的环境引入到该循环相比，这些声明在某种程度上于每次遍历，都创建出一个新的作用域。因此这就跟使用IIFE有着异曲同工的效果，那么就可以仅使用`let`来改写旧版的`setTimeout`示例了。

```typescript
for (let i = 0; i < 10; i++) {
    setTimeout(function () { console.log(i); }, 100 * i);
}
```

将如预期的那样，输出以下结果：

```bash
0
1
2
3
4
5
6
7
8
9
```


