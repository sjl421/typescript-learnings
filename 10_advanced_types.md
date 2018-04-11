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

### 用户定义的类型保护（User-Defined Type Guards）

请注意上面必须要使用多次的类型断言。如果在一旦完成检查，就可以知晓各个分支中`pet`的类型，那就会好很多（Notice that we had to use type assertion several times. It would be much better if once we performed the check, we could know the type of `pet` within each branch）。

因为TypeScript有着名为 *类型保护（type guard）*特性，那么很容易做到了。类型保护一些执行运行时检查的表达式，用以确保类型出于特定范围。要定义一个类型保护，只需定定义一个返回值为 *类型谓词* 的函数即可（It just so happens that TypeScript has something called a *type guard*. A type guard is some expression that performs a runtime check that guarantees the type in some scope. To define a type guard, we simply need to define a function whose return type is a *type perdicate*）。

```typescript
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}
```

`pet is Fish`就是该示例中的类型谓词。谓词的形式就是`parameterName is Type`，其中的`parameterName`必须是当前函数签名中某个参数的名称。

现在只要以某个变量对`isFish`进行调用，如果初始类型兼容，那么TypeScript就会将那个变量 *缩小* 到特定类型（Any time `isFish` is called with some variable, TypeScript will *narrow* that variable to that specific type if the original type is compatible）。

```typescript
// 现在对`swim`与`fly`的调用都没有问题了

if (isFish(pet)) {
    pet.swim();
}
else {
    pet.fly();
}
```

请注意TypeScript不仅知道`if`分支语句中的`pet`是一个`Fish`；它还知道在`else`分支语句中，在不是`Fish`时，那么就肯定是`Bird`了。

### `typeof`的类型保护（`typeof` type guards）

现在来回头写一下使用联合类型版本的`padLeft`。可像下面这样使用类型谓词加以编写：

```typescript
function isNumber(x: any): x is number {
    return typeof x === "number";
}

function isString(x: any): x is string {
    return typeof x === "string";
}

function padLeft (value: string, padding: string | number) {
    if (isNumber(padding)) {
        return Array(padding + 1).join("  ") + value;
    }
    if (isString(padding)) {
        return padding + value;
    }

    throw new Error(`Expected string or number, got '${padding}'`);
}
```

但是，这里不得不去定义一个函数来判断某个原生类型就太痛苦了。幸运的是，因为TypeScript本身就可以将`typeof x === "number"`识别为类型保护，所以无需将其抽象到其本身的函数中。那就意味着可将这些检查写在行内（That means we could just write these checks inline）。

```typescript
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join("  ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'`);
}
```

这些 *`typeof` 的类型保护* 被以两种形式加以识别：`typeof v === "typename"` 与 `typeof v !== "typename"`，其中的`typename`必须是`"number"`、`"string"`、`"boolean"`或`"symbol"`。尽管TypeScript不会阻止与其它字符串进行对比，但语言不会将这些表达式作为类型保护加以识别。

### `instanceof`的类型保护

在了解了有关`typeof`类型保护后，并熟悉JavaScript中的`instanceof`运算符的话，那么对本小节的内容就有了个大概了解了。

*`instanceof` 类型保护* 是一种使用构造函数来限定类型的方式（ *`instanceof` type guards* are a way of narrowing types using their constructor function ）。下面借用之前的生产中的字符串追加器实例来做说明：

```typescript
interface Padder {
    getPaddingString(): string
}

class SpaceRepeatingPadder implements Padder {
    constructor (private numSpaces: number) {  }

    getPaddingString () {
        return Array(this.numSpaces + 1).join("  ");
    }
}

class StringPadder implements Padder {
    constructor (private value: string) {}

    getPaddingString () {
        return this.value;
    }
}

function getRandomPadder () {
    return Math.random() < 0.5 ?
        new SpaceRepeatingPadder (4) :
        new StringPadder("  ");
}

// 类型是 `SpaceRepeatingPadder | StringPadder`
let padder: Padder = getRandomPadder();

if ( padder instanceof SpaceRepeatingPadder ) {
    padder; // 类型被限定为 `SpaceRepeatingPadder`
}

if ( padder instanceof StringPadder ) {
    padder; // 类型被限定为`StringPadder`
}
```

`instanceof`的右侧需要是构造函数，而TypeScript将把变量限定为（The right side of the `instanceof` needs to be a constructor function, and TypeScript will narrow down to）:

1. 在该函数的`prototype`属性类型不是`any`时，该函数的`prototype`属性类型（the type of the function's `prototype` property if its type is not `any`）

2. 该函数`prototype`属性类型的构造签名所返回的类型联合（the union of types returned by that type's construct signatures）

并按二者的先后顺序进行。

## 可为空值的类型（Nullable types）

TypeScript有两种特别的类型，`null`与`undefined`，相应地有着空值与未定义值。在[基本类型章节](00_basic_data_types.md)对它们进行了简要介绍。默认情况下，类型检查器认为`null`与`undefined`可被赋值给任何变量。对于所有类型，`null`与`undefined`都是有效的值。那就意味着，要 *阻止* 将它们赋值给各种类型，即使有意这样做，都是不可能的。`null`值的发明者，Tony Hoare, 把这一特性，称之为他的[“十亿美元错误”](https://en.wikipedia.org/wiki/Null_pointer#History)。

编译器的`--strictNullChecks`开关可修正这一点：在声明某个变量时，它就不自动包含`null`或`undefined`了。要显式地包含它们，可使用联合类型：

```typescript
let s = "foo";
s = null; // 错误，`null` 无法赋值给`string`

let sn: string | null = "bar";
sn = null; // 没有问题

sn = undefined; // 错误，`undefined` 无法赋值给 `string | null`
```

请留意TypeScript是以不同方式来对待`null`与`undefined`的，这是为了与JavaScript的语义相匹配。`string | null`与`string | undefined` 及`string | undefined | null`是不同的类型。

### 可选参数与属性（Optional parameters and properties）

在开启`--strictNullChecks`编译选项时，可选参数将自动加上`| undefined`：

```typescript
function f(x: number, y?: number) {
    return x + (y || 0);
}

f(1, 2);
f(1);
f(1, undefined);
f(1, null); //错误，`null`不能赋值给`number | undefined`
```

对于可选属性，这也是适用的：

```typescript
class C {
    a: number;
    b?: number;
}

let c = new C();
c.a = 12;
c.a = undefined; // 错误，`undefined`不能赋值给`number`
c.b = 13;
c.b = undefined;
c.b = null; // 错误，`null` 无法赋值给`number | undefined`
```

### 类型保护与类型断言（Type guards and type assertions）

因为可为空值类型，是以联合（a union）实现的，那么就需要使用类型保护来处理`null`。幸运的是，这与在JavaScript中所写的代码一样：

```typescript
function f (sn: string | null): string {
    if (sn == null) {
        return "default";
    }
    else {
        return sn;
    }
}
```

这里`null`的排除是相当直观的，但也可以使用更简洁的运算符：

```typescript
function f (sn: string | null): string {
    return sn || "default";
}
```

在那些编译器无法消除`null`或`undefined`的地方，可使用类型断言运算符（the type assertion operator）来手动移除它们。该语法就是后缀`!`的使用: `identifier!`将从`identifier`的类型中移除`null`与`undefined`：

```typescript
function broken(name: string | null): string {
    function postfix(epithet: string) {
        return name.charAt(0) + '. the ' + epithet; // 错误，`name` 可能是`null`
    }

    name = name || "Bob";
    return postfix("great");
}

function fixed(name: string | null): string {
    function postfix(epithet: string) {
        return name!.charAt(0) + '. the ' + epithet; // 没有问题
    }

    name = name || "Bob";
    return postfix("great");
}
```

因为编译器无法消除嵌套函数内部的空值（除了那些立即执行函数表达式外），因此该示例使用了一个嵌套函数。而编译器之所以无法消除嵌套函数内的空值，是因为编译器无法对所有的嵌套函数调用进行追踪，尤其是在外层函数内返回嵌套函数时。由于编译器在不知道嵌套函数在何处调用，那么它就无法知道函数体执行时`name`的类型会是什么（The example uses a nested function here because the compiler can't eliminate nulls inside a nested function(except immediately-invoked function expressions). That's because it can't track all calls to the nested function, especially if you return it from the outer function. Without knowing where the function is called, it can't know what the type of `name` will be at the time the body executes）。


## 类型别名（Type Aliases）

类型别名特性，为某个类型创建出一个新的名称。类型别名有时与接口类似，但可以对原生类型、联合类型、元组及其它不得不手写的类型进行命名（Type aliases create a new name for a type. Type aliases are sometimes similar to interfaces, but can name primitives, unions, tuples, and any other types that you'd otherwise have to write by hand）。

```typescript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;

function getName (n: NameOrResolver): Name {
    if ( typeof n === "string" ) {
        return n;
    }
    else {
        return n();
    }
}
```

命名操作并不会直接创建出一个新类型 -- 其创建出一个到那个类型引用的 *名称* （Aliasing doesn't actually create a new type - it creates a new *name* to refer to that type）。对原生类型的重命名并不十分有用，不过这可用作一种程序文档的形式。

与接口一样，类型别名也可以是泛型的（通用的） -- 可仅加上类型参数，并在别名声明的右侧使用即可。

```typescript
type Container<T> = { value: T };
```

还可以在属性中引用类型别名本身：

```typescript
type Tree<T> {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
}
```

当与交集类型一起时，就可以做出一些相当令人费解的类型：

```typescript
type LinkedList<T> = T & { next: LinkedList<T> };

interface Person {
    name: string;
}

var people: LinkedList<Person>;
var s = people.name;
var s = people.next.name;
var s = people.next.next.name;
var s = people.next.next.next.name;
```

但是，要将类型别名放在声明右侧的任意地方，是不可能的：

```typescript
type Yikes = Array<Yikes>; //错误
```

### 接口与类型别名（Interfaces vs. Type Aliases）

如前面所提到的，类型别名能表现得有点像接口那样；但类型别名与接口也有着些许不同。

一个差异在于接口创建出在所有地方使用的新名称。而类型别名并不会创建出新名称 -- 举例来说，错误消息就不会使用别名。在下面的代码里，如在代码编辑器中鼠标悬挺在`interfaced`上，就会提示其返回的是一个`Interface`，但对于`aliased`，则将提示返回的是对象字面值类型（object literal type）。

```typescript
type Alias = { num: number }
interface Interface {
    num: number;
}

declare function aliased (arg: Alias): Alias;
declare function interfaced (arg: Interface): Interface;
```

第二个重要的不同，就是类型别名不能被扩展或被实施（它们也不能扩展或实施其它类型，A second important difference is that type aliases cannot be extended or implemented from(nor can they extend/implement other types)）。由于[软件的理想属性，在于对扩展始终开放](https://en.wikipedia.org/wiki/Open/closed_principle)，因此应尽可能使用接口，而不是类型别名。

反过来说，在无法使用接口类表达某个外形（建模）及需要使用联合或元组类型时，往往就是类型别名派上用场的时候。

## 字符串字面类型（String Literal Type）


