# ECMAScript 2015(ES6) 学习记录

ECMAScript 2015 (ES6)已经正式发布，所有浏览器均已支持，同时许多项目，如Angular, Ionic/Electron框架等，均已在往ES6迁移。故需要学习掌握这一新版的Javascript。

## ES6与 Javascript

ES6仍然是Javascript, 只不过是在我们已经熟悉的Javascript上加入了一些新的东西。使得Javascript更为强大，可以应对大型程序的要求。

## ES6的实现

ES6只是新一代Javascript的规范，几大公司、各个浏览器引擎等都有具体的实现。微软的TypeScript、CoffeeScript等都是ES6的具体实现。

参考链接：

- https://blog.mariusschulz.com/2017/01/13/typescript-vs-flow
- http://blog.ionicframework.com/ionic-and-typescript-part-1/

鉴于Angular与Ionic都是使用了微软的TypeScript, 因此在学习ES6时，将学习TypeScript这一实现。

## 关于TypeScript

TypeScript是Javascript的超级，有着以下优势：

- 可选的静态类型（关键就是这里的“可选”, Optional static typing, the key here is optional）
- 类型推理，此特性在并没有使用到类型的情况下，带来那些类型的诸多益处（Type Inference, which gives some of the benefits of types, without actually using them）
- 可在主流浏览器尚未对ES6/ES7提供支持之前，通过TypeScript用上ES6及ES7的特性
- TypeScript有着将程序向下编译到所有浏览器都支持的某个Javascript版本的能力
- IntelliSense提供了极好的工具支持

因为TypeScript带给如你一样的开发者这些不错的特性及巨大优势，Ionic是以TypeScript编写的，而不是ES6（这里就表明了**TypeScript并不是ES6**）。

### 关于可选的静态类型

可能TypeScript最能打动人心的，就是其所提供到的可选静态类型系统了。将给变量、函数、属性等加上类型。这将帮到编译器，且在app尚未运行时，就给出有关代码中任何潜在错误的警告。在使用到库及框架时，类型也有帮助，这是由于类型可令到开发者准确知悉那些APIs期望何种类型的数据。而关于类型系统，你首先要记住的是它是可选的。TypeScript并不强制要求开发者在他们不想添加的上必须添加类型。但随着应用变得越来越大、越来越复杂，类型确实可以提供到一些很棒的优势。

关于 IntelliSense:

> 一种 Microsoft 技术，这种技术通过在光标悬停在函数上时显示类定义和注释，从而让您可以分析源代码。当您在 IDE 中键入函数名时，IntelliSense 还可以完成这些名称。

TypeScript的一大优势，就是其代码补全与IntelliSense了。IntelliSense在敲入代码时，提供有用的提示。因为Ionic本身就是用TypeScript写就的，代码编辑器就可以展示出所有可用的方法，以及这些方法所期望的参数。当今所有最好的集成开发环境，比如VScode、Atom、Sublime text，甚至那些诸如Vim/Neovim等命令行的编辑器，都有对代码补全的支持。

TypeScript的许多优势，带来了一种好得多的app开发体验。因此，Ionic将全力压注到TypeScript上，而不提供ES6的启动器。

摘录自：

> [TypeScript的优势](https://ionicframework.com/docs/developer-resources/typescript/)
