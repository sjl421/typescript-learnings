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
