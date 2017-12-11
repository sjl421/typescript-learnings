# 接口（Interfaces）

## 简介

TypeScript语言的核心原则之一，就是类型检查着重于值所具有的 *形（shape）*（One of TypeScript's core principles is that type-checking focuses on the *shape* that values have）。这有时候被称为“[鸭子类型（duck typing）](https://zh.wikipedia.org/wiki/%E9%B8%AD%E5%AD%90%E7%B1%BB%E5%9E%8B)” 或 “[结构化子类型（structural subtyping）](https://openhome.cc/Gossip/Scala/StructuralTyping.html)”。在TypeScript中，接口充当了这些类型名义上的角色，且是一种定义代码内的合约（约定），以及与项目外部代码的合约约定的强大方式（In TypeScript, interfaces fill the role of naming these types, and are a powerfull way of defining contracts within your code as well as contracts with code outside of your project）。


## 接口初步（Our First Interface）

理解接口的最容易方式，就是从一个简单的示例开始：

```typescript
function printLable (labelledObj: { label: string }) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};

printLable(myObj);
```

类型检查器对`printLable`的调用进行检查。函数`printLable`有着一个单独参数，该参数要求所传入的对象要有一个名为`label`、类型为字符串的属性。请注意这里的`myObj`实际上有着更多的属性，但编译器对传入的参数只检查其 *至少* 有着列出的属性，且要匹配要求的类型。当然也存在TypeScript编译器不那么宽容的情形，这一点在后面会讲到。

可以再次编写此示例，这次使用接口来描述需要具备`label`属性这一要求：

```typescript
interface LabelledValue {
    label: string;
}

function printLable ( labelledObj: LabelledValue ) {
    console.log(labelledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLable (myObj);
```

这里的`LabelledValue`接口，是一个立即可用于描述前一示例中的要求的名称。它仍然表示有着一个名为`label`、类型为字符串的属性。请注意这里并没有像在其它语言中一样，必须显式地说传递给`printLable`的对象应用该接口。这里只是那个 *形（shape）* 才是关键的。如果传递给该函数的对象满足了列出的要求，那么就是允许的。

这里需要指出的是，类型检查器不要求这些属性以何种顺序进入，只要有接口所要求的属性及类型即可。


## 可选属性（Optional Properties）

接口可以包含并不需要的属性。在特定条件下某些属性存在，或根本不存在（Not all properties of an interface may be required. Some exist under certain conditions or may not be there at all）。在建立像是那种将某个仅有少数属性的对象，传递给某个函数的“选项包（option bags）”的模式时，这些可选属性用得比较普遍。

下面是此种模式的一个示例：

```typescript
interface SquareConfig {
    color?: string;
    width?: number?
}

function createSquare ( config: SquareConfig ): {color: string; area: number} {
    let newSquare = {color: "white", area: 100};

    if (config.color) {
        newSquare.area = config.with * config.width;
    }

    return newSquare;
}

let mySquare = createSquare({color: "black"});
```

带有可选属性的接口，其写法与其它接口相似，只需在各个可选属性的声明中，在属性名字的末尾，以`?`加以表示即可。

使用可选属性的优势在于，在对可能存在的属性进行描述的同时，仍然可以阻止那些不是该接口组成部分的属性的使用。比如
