import { Calculator } from "./Calculator";

class ProgrammerCalculator extends Calculator {
    static digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

    constructor (public base: number) {
        super();

        if (base <= 0 || base > ProgrammerCalculator.digits.length) {
            throw new Error("基数必须要在0到16的范围");
        }
    }

    protected processDigit(digit: string, currentValue: number) {
        if (ProgrammerCalculator.digits.indexOf(digit) >= 0) {
            return currentValue * this.base + ProgrammerCalculator.digits.indexOf(digit);
        }
    }
}

// 将新的已扩展的计算器作为`Calculator`进行导出
export { ProgrammerCalculator as Calculator };

// 还要导出辅助函数
export { test } from "./Calculator";
