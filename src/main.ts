import {sayHello} from "./greet"


function showHello (divName: string, name: string){
    const el = document.getElementById(divName);
    el.innerText = sayHello(name);
}

let 
// 逻辑值（布尔值）, Boolean
isDone: boolean = false,
    // 数值, Number。注意：TypeScript里所有数字都是浮点数
    weight: number = 95.2,

    // 字符串, String。注意：TypeScript支持多行字符串, 及模板语法
    name: string = "Peng Hailin, Have a good day!",
    sentence: string = `${name},
        that's what I wanner say.
        `,

    // 数组，Array。注意：下面是数组的两种写法
    list: string[] = ['Peng Hailin', 'Have a good day!'],
    points: Array<number> = [5, 3.14159, -0.58];

points.forEach((p)=>{
    sentence = sentence.concat(` ${p.toString()}`);
});

list.forEach((s)=>{
    sentence = sentence.concat(` ${s} `);
});

// 元组，Tuple
let  x: [string, number];

x = ['height', 181];

console.log(x[0].substr(1));
console.log(x[1]);

x[3] = 'fat';

x[6] = true; // 这里编译器会报错：（error TS2322: Type 'true' is not assignable to type 'string | number'.）

console.log(x[6].toString());

// 枚举，enum
enum Color {Red = 1, Green = 2, Blue = 4};

let c: Color = Color.Green;
let colorName: string = Color[2];

console.log(c, colorName);

// 任意值，any
let notSure: any = 4;
// notSure.ifItExists();
// console.log();
notSure.toFixed()
console.log(notSure);

// 对象与任意值的比较
let prettySure: Object = 4;
prettySure.toFixed();


// 空值，avoid

function warnUser(): avoid {
    alert('This is my warning message.');
}


showHello("greeting", sentence);

