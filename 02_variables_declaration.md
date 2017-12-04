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

