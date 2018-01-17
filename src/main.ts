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

let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12;
ro.push(5);
ro.length = 100;
a = ro as number[];
console.log(a);

