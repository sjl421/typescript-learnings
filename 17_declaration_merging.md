# 声明融合特性

**Declaration Merging**

## 简介

TypeScript中有一些特有概念，它们在类型级别对JavaScript对象外形进行描述（Some of the unique concepts in TypeScript describe the shape of JavaScript objects at the type level）。一个尤其特定于TypeScript的例子，就是“声明融合”这一概念。对此概念的掌握，对于与现有Javascript操作，较有优势。对此概念的掌握，也开启了其它复杂抽象概念的大门。

作为本文的目标，“声明融合”特性，就是指编译器把两个以相同名称进行声明的单独声明，融合为一个单一声明。融合后的声明，有着原先两个声明的特性。任意数目的声明都可被融合；而不受限于仅两个声明。

## 基本概念

在TypeScript中，一个声明将创建出至少三组之一的实体：命名空间、类型或值。命名空间创建式声明创建出包含可通过使用 *点缀符号* 进行访问的名称的命名空间（In TypeScript, a declaration creates entities in at least one of three groups: namespace, type, or value. Namespace-creating declarations create a namespace, which contains names that are accessed using a dotted notation）。类型创建式声明，则仅完成这些：它们
