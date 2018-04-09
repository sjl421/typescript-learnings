#复杂类型

**Advanced Types**

##交集类型（Intersection Types）

交集类型将多个类型结合为一个。该特性令到将既有类型加在一起，从而得到一个有着所有所需特性的单个类型。比如，`Person & Serializable & Loggable`就是一个`Person` *与* `Serializable` *与* `Loggable`。那就意味着此类型的对象，将有着所有三个类型的所有成员。

多数情况下，交集类型都用在混入及其它一些无法放入到经典的面向对象模子中的一些概念。（JavaScript中可是有很多这种概念！You will mostly see intersection types used for mixins and other concepts that don't fit in the classic object-oriented mold. (There are a lot of these in JavaScript!)）下面是一个演示如何创建混入的示例：

```typescript
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U> {};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    return result;
}

class Person {
    constructor (public name: string) {}
}

interface Loggable {
    log(): void;
}

class ConsoleLogger implements Loggable {
    log() {
        //...
    }
}

var jim = extend(new Person("Jim"), new ConsoleLogger());
var n = jim.name;
jim.log();
```

## 联合类型（Union Types）

联合类型与交集类型密切相关，但二者的用法却截然不同。少数情况下，将遇到某些需要一个可能是`number`，也可能是`string`参数的库。请看下面这个函数的实例：

```typescript
/**
 * 取得一个字符串并将`padding`添加到其左侧。
 * 如果`padding`是一个字符串，那么`paddin`就被追加到左侧。
 * 如果`padding`是一个数字，那么该数目个的空格就被追加到左侧。
 */

function padLeft (value: string, padding: any) {
    if (typeof padding === "number") {
        return Array(padding + 1).join("  ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }

    throw new Error(`Expected string or number, got '${padding}'`);
}

padLeft("Hello world", 4);
```

`padLeft`函数的问题在于，它的`padding`参数所赋予的类型是`any`。那就意味着可以一个既不是`number`也不是`string`的参数对其进行调用，TypeScript也不会检查到问题。

```typescript
let indentedString = padLeft("Hello world", true); // 在编译时可通过，但运行时失败。
```

在传统的面向对象代码中，可能会通过创建出类型的层次，来对这两种类型进行抽象。虽然这样做相对比较显式，但其也有些矫枉过正了。上面那个最初版本的`padLeft`有一个好的方面，就是可仅传入原生类型的参数（One of the nice things about the original version of `padLeft` was that we were able to just pass in primitives）。那意味着其用法是较为简洁的。而如仅尝试使用一个已在其它地方存在的函数，新方法也没有用。

对于`padding`参数，可使用 *联合* 类型类来代替`any`:

```typescript
/**
 * 取得一个字符串并将`padding`添加到其左侧。
 * 如果`padding`是一个字符串，那么`paddin`就被追加到左侧。
 * 如果`padding`是一个数字，那么该数目个的空格就被追加到左侧。
 */

function padLeft (value: string, padding: string | number) {
    // ...
}

let indentedString = padLeft("Hello world", true); // 这时在编译时就会报错了。
```

联合类型将某个值描述为可以是多个类型的某一种。使用竖杠`|`来将各个类型分开，那么`number | string | boolean`就是说某个值的类型，可以是一个`number`、`string`或者`boolean`。

加入有着一个带有联合类型的值，那么就只能访问那些在联合中所有类型都具备的成员（If we have a value that has a union type, we can only access members that are common to all types in the union）。

```typescript
interface Bird {
    fly();
    layEggs();
}

interface Fish {
    swim();
    layEggs();
}

function getSmallPet(): Fish | Bird {
    // ...
}

let pet = getSmallPet();

pet.layEggs(); // 没有问题
pet.swim(); // 错误
```

这里联合类型就有些摸不着头脑了，不过只需要一些直觉，就可以习惯它。加入某个值有着类型`A | B`，那就唯一能 **明确** 的是，它有着`A` **与** `B` 都有的成员。在本示例中，`Bird`有一个名为`fly`的成员。这里无法确定某个类型为`Bird | Fish`的变量具有`fly`的方法。如果运行时该变量实际上是`Fish`，那么调用`pet.fly()`就将失败。

## 类型保护与区分类型（Type Guards and Differentiating Types）

当某些值可能在它们所承载的类型上出现重叠时，联合类型对于这些情况下的建模是有用的。那么当需要明确知道是否有着一个`Fish`时，会发生什么呢？JavaScript中区分两个可能的值的习惯做法，就是对是否存在某个成员进行检查。如上面所提到的，只能访问到那些保证位于联合类型的所有构成类型中成员（Union types are useful for modeling situations when values can overlap in the types they can take on. What happens when we need to know specifically whether we have a `Fish`? A common idiom in JavaScript to differentiate between two possible values is to check for the presence of a member. As we mentioned, you can only access members that are guaranteed to be in all the constituents of a union type）。

```typescript
let pet = getSmallPet();

// 这些属性访问都将引发错误
if (pet.swim) {
    pet.swim();
}
else if (pet.fly) {
    pet.fly();
}
```

为让同样的代码工作，就需要使用类型断言（a type assertion）:

```typescript
let pet = getSmallPet();

if ((<Fish>pet).swim) {
    (<Fish>pet).swim();
}
else {
    (<Bird>pet).fly();
}
```


