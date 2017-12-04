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

points.push('test');
points.pop();
    
points.forEach((p)=>{
    sentence = sentence.concat(` ${p.toString()}`);
});

list.forEach((s)=>{
    sentence = sentence.concat(` ${s} `);
});

showHello("greeting", sentence);

