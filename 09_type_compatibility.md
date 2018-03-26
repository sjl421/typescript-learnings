# 类型兼容性

**Type Compatibility**

## 简介

TypeScript中的类型兼容性，是基于结构化子类型赋予的。结构化的类型赋予，是一种仅依靠类型的成员，而将这些类型联系起来的方式。这一点与名义上的类型赋予有所不同（Type compatibility in TypeScript is based on structural subtyping. Structural typing is a way of relating types based solely on their members. This is in contrast with nominal typing）。请考虑以下代码：
