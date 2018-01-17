'use strict';

// 接口，Interfaces
interface LabelledValue {
    label: string;
}

function printLable (labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};

printLable(myObj);

// 可选属性
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare ( config: SquareConfig ): { color: string; area: number } {
    let newSquare = { color: "white", area: 100 };
    
    if (config.color) {
        newSquare.color = config.color;
    }

    if ( config.width ) {
        newSquare.area = config.width * config.width;
    }

    return newSquare;
}

let mySquare = createSquare({color: "black", width: 100});


// 只读属性，Readonly properties

interface Point {
    readonly x: number;
    readonly y: number;
}

let p1: Point = { x: 10, y: 20 };

// 多余属性检查


// 可索引类型
class Animal {
    name: string;
}

class Dog extends Animal {
    breed: string;
}

interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}

interface NumberDictionary {
    [index: string]: number;
    length: number;
    name: string;
}

interface ReadonlyStringArray {
    readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory";

