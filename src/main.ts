'use strict';

enum Response {
    No = 0,
    Yes,
}

function respond (recipient: string, message: Response): void {
    // ...
    console.log(recipient, message);
}

respond ("Princess Caroline", Response.Yes);

function getSomeValue():  number { return 100; }

console.log(getSomeValue());

enum E {
    A = getSomeValue (),
    B, // 
}
