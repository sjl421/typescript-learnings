# 命名空间

> **关于术语的一点说明**：在TypeScript 1.5中需要注意的是，其中的命名法发生了改变。为了与ECMAScript 2015的命名法保持一致，"内部模块"以及被命名为“命名空间”。“外部模块”已被简化为“模块”，（名以上`module X {`与现在所指的`namespace X{`是等价的。it's important to note that in TypeScript 1.5, the nomenclature has changed. "Internal modules" are now "namespace". "External modules" are now simply "modules", as to align with ECMAScript 2015's terminology, (namely that `module X {` is equivalent to the now-preferred `namespace X{`)）。

## 简介

本文指出了TypeScript中使用命名空间（也就是先前的“内部模块”）来组织代码的不同方法。正如在有关命名法的注释中所暗示的，现已使用“命名空间”来指代“内部模块”了。此外，在将`module`关键字用于声明某个内部模块时，都可以且应当使用`namespace`关键字。这样做可避免由相似命名的用词带来的负担，而令到新用户迷惑。

## 第一步（First Steps）


