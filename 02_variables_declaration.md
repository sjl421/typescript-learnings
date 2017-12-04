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

## 作用域规则
