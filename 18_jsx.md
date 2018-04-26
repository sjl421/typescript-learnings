# JSX

## 简介

[JSX](https://facebook.github.io/jsx/)是一种可嵌入式的、类似于XML的语法（JSX is an embeddable XML-like syntax）。其是为了被转换成有效的JavaScript，固然那种转换的语义是特定于具体实现的。JSX的流行，是由[React](https://reactjs.org/)框架的流行带来的，在其它应用中也有见到JSX。TypeScript支持JSX的嵌入、类型检查及将JSX直接编译到JavaScript。

## 基本用法（Basic Usage）

为了使用JSX，必须完成两件事：

1. 以`.tsx`扩展名来命名文件

2. 开启`jsx`选项（编译器的）

TypeScript本身带有三个JSX模式：`preserve`、`react`与`react-native`。这些模式仅影响生成阶段 -- 类型检查不受影响。`preserve`模式将保留JSX作为输出的部分，以被其它转换步骤（比如[Babel](https://babeljs.io/)）进一步处理。此外该模式下的输出将有着`.jsx`文件扩展名。`react`模式将生成`React.createElement`，在使用钱不需要通过JSX转换，同时输出将有着`.js`文件扩展名。`react-native`模式与`preserve`等价，该模式下将保留所有JSX，但输出仍将为`.js`文件扩展名。

| 模式 | 输入 | 输出 | 输出文件扩展名 |
| :--- | :--- | :--- | :--- |
| `preserve` | `<div />` | `<div />` | `.jsx` |
| `react` | `<div />` | `React.createElement("div")` | `.js` |
| `react-native` | `<div />` | `<div />` | `.js` |

可通过命令行标志`--jsx`或在`tsconfig.json`文件中的相应选项，来对此模式进行指定。

>  *注意：* 标识符`React`是硬编码的，因此必须要有`R`开头的React。

## `as`运算符（The `as` Operator）

回顾一下类型断言（a type assertion）是怎么写的：

```typescript
var foo = <foo>bar;
```

这里对变量`bar`有着类型`foo`进行了断言。因为TypeScript也将尖括号用于类型断言，因此JSX的语法就引入了一些解析困难。结果就是，TypeScript不允许在`.tsx`文件中出现尖括号类型断言。

为了弥补`.tsx`文件中的这个功能损失，就加入了一个新的类型断言运算符：`as`。使用`as`运算符，上面的示例就可很容易写出来。

```typescript
var foo = bar as foo;
```

在`.ts`与`.tsx`文件中，都可以使用`as`运算符，其作用与其它类型断言样式一致。

## 类型检查（Type Checking）

为了理解JSX下的类型检查，就必须首先掌握固有元素与基于值的元素的区别（In order to understand type checking with JSX, you must first understand the difference between intrinsic elements and value-based elements）。对于一个JSX表达式`<expr />`，`expr` 既可以是对环境中固有元素（比如DOM环境中的`div`或`span`）的参考，也可以是对某个创建出来的组件的参考。因为以下两个原因，这一点很重要：

1. 对于React, 固有元素生成的是字符串（`React.createElement("div")`），但对于创建出的组件则不是（`React.createElement(MyComponent)`）。

2. 传入给JSX的属性的类型，应以不同的方式进行查找。固有元素属性应本质上就知道，而组件将期望给它们指定一套属性（The types of the attributes being passed in the JSX element should be looked up differently. Intrinsic element attributes should be known *intrinsically* whereas components will likely want to specify their own set of attributes）。

对于如何区分二者，TypeScript使用了[与React相同的约定](http://facebook.github.io/react/docs/jsx-in-depth.html#html-tags-vs.-react-components)。固有元素总是以小写字母开头，而基于值的元素则全部以大写字母开头。

### 固有元素（Intrinsic elements）

固有元素是在一个特殊接口`JSX.IntrinsicElements`上查找的。默认情况下，如果没有指定该接口，那么什么都可以且固有元素不会被检查类型。但如果指定了该接口，那么固有元素的名称将作为一个属性，在`JSX.IntrinsicElements`上进行查找。比如：

```typescript
declare namespace JSX {
    interface IntrinsicElements {
        foo: any
    }
}

<foo />; // 没有问题
<bar />; // 错误
```

在上面的示例中，`<foo />`将正确工作，但`<bar />`将因为其没有在`JSX.IntrinsicElements`上进行指明，而导致一个错误。

> 注意： 也可以像下面这样，在`JSX.IntrinsicElements`上指定一个全能字符串索引器（a catch-all string indexer）。

```typescript
declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}
```

### 基于值的元素（Value-based elements）

基于值的元素，是简单地通过作用域中的标识符进行查找的。

```typescript
import MyComponent from "./MyComponent";

<MyComponent />; // 没有问题
<SomeOtherComponent />; // 错误
```

基于值元素的定义有两种方式：

1. 无状态函数式组件方式（Stateless Functional Component, SFC）

2. 类组件方式（Class Component）

因为在JSX表达式中二者难于区分，所以首先会尝试使用 **过载方案** 来将表达式作为无状态函数式组件进行解析（Because these two types of value-based elements are indistinguishable from each other in JSX expression, we first try to resolve the expression as Stateless Functional Component using **overload resolution**）。加入该过程成功，那么就完成了将表达式解析为其声明。而在将其解析为SFC失败时，就会尝试将其作为类组件进行解析。加入仍然失败，就会报告一个错误。

***关于无状态函数式组件***

***Stateless Functional Components***

如同该名称所体现的那样，这种组件是以首个参数为`props`对象的JavaScript函数进行定义的。这里要强调，其定义函数的返回值，必须是可赋值给`JSX.Element`的类型

```typescript
interface FooProp {
    name: string;
    X: number;
    Y: number;
}

declare function AnotherComponent (prop: {name: string});

function ComponentFoo (prop: FooProp) {
    return <AnotherComponent name=prop.name />;
}

const Button = (prop: {value: string}, context: { color: string }) => <button>;
```

因为SFC就是简单的JavaScript函数，因此这里也可以使用函数过载特性（function overload）。

```typescript
interface ClickableProps {
    children: JSX.Element[] | JSX.Element
}

interface HomeProps extends ClickableProps {
    home: JSX.Element;
}

interface SideProps extends ClickableProps {
    side: JSX.Element | string;
}

function MainButton (prop: HomeProps): JSX.Element;
function MainButton (prop: SideProps): JSX.Element {
    // ...
}
```

***类组件***

对类组件的限定是可行的。但为达到这个目的，就必须引入两个新术语： *元素类类型* 与 *元素示例类型* （the *element class type* and the *element instance type*）。

在给定了`<Expr />`时，那么 *元素类类型* 就是 `Expr` 的类型。因此在上面的示例中，在`MyComponent`是一个ES6的类时，那么类类型就应是那个类。而如果`MyComponent`是一个工厂函数（a factory function），那么类类型就应是那个函数。

类类型一旦建立，实例类型就有该类类型的调用签名与构造签名的返回值类型联合确定下来（Once the class type is established, the instance type is determined by the union of the return types of the class type's call signatures and construct signatures）。因此又会出现，在ES6类的情况下，实例类型将会是那个类的实例的类型，同时，在工厂函数的情况下，实例类型将是自函数返回值的类型。

```typescript
class MyComponent {
    render(){}
}

// 使用构造签名
var myComponent = new MyComponent();

// 元素类类型为 `MyComponent`
// 元素实例类型为 `{ render: () => void }`

function MyFactoryFunction () {
    return {
        render: () => {
            // ...
        }
    }
}

// 使用调用签名
var = myComponent = MyFactoryFunction();

// 元素类类型为 `FactoryFunction`
// 元素实例类型为 `{ render: () => void }`
```

元素实例类型很有趣，因为它必须是可赋值给`JSX.ElementClass`的，否则就会造成错误。默认`JSX.ElementClass`就是`{}`，但可将其扩充为将`JSX`的使用限制到仅符合适当接口的那些类型（By default `JSX.ElementClass` is `{}`, but it can be augmented to limit the use of JSX to only those types that conform to the proper interface）。

```typescript
declare namespace JSX {
    interface ElementClass {
        render: any;
    }
}

class MyComponent {
    render () {}
}

function MyFactoryFunction () {
    return { render: () => {} }
}

<MyComponent />; // 没有问题
<MyFactoryFunction />; // 没有问题

class NotAValidComponent {}
function NotAValidFactoryFunction () {
    return {};
}

<NotAValidComponent />; //错误
<NotAValidFactoryFunction />; // 错误
```

### 属性类型的检查

对属性的类型检查的第一步，就是确定 *元素属性类型* （The first step to type checking attributes is to determine the *element attributes type*）。这一步对于固有元素及基于值的元素有些许的不同。

对于固有元素，元素属性类型就是`JSX.IntrinsicElements`上的属性的类型

```typescript
declare namespace JSX {
    interface IntrinsicElements {
        foo: { bar?: boolean }
    }
}

// `foo`的元素属性类型，就是 `{bar?: boolean}`
<foo bar />;
```

对于基于值的元素，元素属性类型这个问题，就复杂一些。元素属性类型是由早前所确定下来的 *元素实例类型* 上的一个属性的类型确定的。至于要使用哪一个属性，则是由`JSX.ElementAttributesProperty`所决定的。`JSX.ElementAttributesProperty`又应该以一个单一属性进行声明。随后就会使用那个属性（For value-based elements, it is a bit more complex. It is determined by the type of a property on the *element intance type* that was previously determined. Which property to use is determined by `JSX.ElementAttributesProperty`. It should be declared with a single property. The name of that property is then used）。

```typescript
declare namespace JSX {
    interface ElementAttributesProperty {
        props; // 指定要使用的属性名称
    }
}

class MyComponent {
    // 指定元素实例类型上的属性
    props: {
        foo?: string;
    }
}

// `MyComponent` 的元素属性类型，就是`{foo?: string}`
<MyComponent foo="bar" />
```

元素属性类型被用于对JSX中的属性进行类型检查。支持可选与必需属性（The element attribute type is used to type check the attributes in the JSX. Optional and required properties are supported）。

```typescript
declare namespace JSX {
    interface IntrinsicElements {
        foo: { requiredProp: string; optionalProp?: number }
    }
}

<foo requiredProp="bar" />; // 没有问题
<foo requiredProp="bar" optionalProp={0} />; //没有问题
<foo />; // 错误，找不到`requiredProp`
<foo requiredProp={0} />; // 错误，`requiredProp`应是字符串
<foo requiredProp="bar" unknownProp />; // 错误，`unknownProp`不存在
<foo requiredProp="bar" some-unknown-prop />; // 没有问题，因为`some-unknown-prop`不是一个有效的标识符
```

> 注意：在某个元素属性名称不是有效的JS标识符（a valid JS identifier, 比如`data-*`这样的元素属性）时，在元素属性类型中没有找到这个无效JS标识符，这不会被认为是一个错误（If an attribute name is not a valid JS identifier(like a `data-*` attribute), it is not considered to be an error if it is not found in the element attributes type）。

展开运算符也是可用的（The spead operator also works）：

```typescript
var props = { requiredProp: "bar" };
<foo {...props} />; // 没有问题

var badProps = {};
<foo {...badProps} />; // 错误
```

### 子元素类型检查（Children Type Checking）

在版本2.3中，引入了对 *子元素* 的类型检查。 *子元素* 是经由元素属性类型检查而确定下来的 *元素属性类型* 的一个属性（ *children* is a property in an *element attributes type* which we have determined from type checking attributes）。与使用`JSX.ElementAttributesProperty`来确定 *props* 的名称类似，也要使用`JSX.ElementChildrenAttributes`来确定 *子元素* 的名称。

应使用单一属性，来对`JSX.ElementChildrenAttributes`进行声明。

```typescript
declare namespace JSX {
    interface ElementChildrenAttributes {
        children: {}; // 指定要使用的 子元素 名称
    }
}
```

在没有显式指定子元素的类型时，就将使用[React typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react) 中的默认类型。


```typescript
<div>
    <h1>Hello</h1>
</div>;

<div>
    <h1>Hello</h1>
    World
</div>;

const CustomComp = (props) => <div>props.children</div>

<CustomComp>
    <div>Hello World</div>
    {"This is just a JS expression..." + 1000}
</CustomComp>
```

可像其它元素属性一样，来指定 *子元素* 的类型。这样做会覆写来自 [React typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react) 的类型。

```typescript
interface PropsType {
    children: JSX.Element
    name: string
}

class Component extends React.Component<PropsType, {}> {
    render () {
        return (
            <h2>
                this.props.children
            </h2>
        );
    }
}

// 没有问题
<Component>
    <h1>Hello World</h1>
</Comonent>

// 错误：子元素 是类型 `JSX.Element` 而不是 `JSX.Element` 的数组
<Component>
    <h1>Hello World</h1>
    <h2>Hello World</h2>
</Component>

// 错误：子元素 是类型 `JSX.Element` 而不是 `JSX.Element` 的数组或字符串
<Component>
    <h1>Hello</h1>
    World
</Component>
```

## JSX结果类型（The JSX result type）

默认JSX表达式的结果的类型为`any`（By default the result of a JSX expression is typed as `any`）。通过指定`JSX.Element`接口，就可以对该类型进行定制。然而从该接口获取有关JSX的元素、元素属性或子元素的类型信息，是无法做到的。其就是一个黑盒。

## 关于表达式的嵌入（Embedding Expressions）

JSX允许通过将表达式以花括符`{}`括起来的方式，将表达式在标签之间进行嵌入（JSX allows you to embed expressions between tags by surrounding the expressions with curly braces(`{}`)）。

```typescript
var a = <div>
    {["foo", "bar"].map(i => <span>{i / 2}</span>)}
</div>
```

因为无法将字符串除以数字，所以上面的代码将得到一个错误。而在使用`preserve`选项时，输出将是下面这样：

```typescript
var a = <div>
    {["foo", "bar"].map(function (i) { return <span>{i / 2}</span>; })}
</div>;
```


## React的集成（React integration）

要使用带有React的JSX，就应使用 [React typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)。这些分型对`JSX`的命名空间以适应React的使用而进行了定义（These typings define the `JSX` namespace appropriately for use with React）。

```typescript
/// <reference path="react.d.ts" />

interface Props {
    foo: string;
}

class MyComponent extends React.Component<Props, {}> {
    render () {
        return <span>{this.props.foo}</span>
    }
}

<MyComponent foo="bar" />; // 没有问题
<MyComponent foo={0} />; // 错误
```
