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


