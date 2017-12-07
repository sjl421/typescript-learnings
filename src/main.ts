'use strict';

class Greeter {
    greeting: string;

    constructor ( message: string ) {
        this.greeting = message;
    }

    greet () {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter ("world");

console.log(greeter.greet());

class Animal {
    public name: string;

    public constructor (theName: string) { this.name = theName; }

    public move ( distanceInMeters: number = 0 ) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor (name: string) { super(name); }

    move ( distanceInMeters = 5 ) {
        console.log( "Slithering..." );
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    height: number;

    constructor (name: string, height: number) { 
        super(name); 
        this.height = height;
    }

    move (distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino", 185);

sam.move();
tom.move(34);


class Creature {
    private name: string;

    constructor ( theName: string ) { this.name = theName; }
}

// new Creature("Cat").name;

class Rhino extends Creature {
    constructor () { super("Rhino"); }
}

class Person {
    protected name: string;

    constructor ( name: string ) { this.name = name; }
}

class Employee extends Person {
    private department: string;

    constructor ( name: string, department: string ) { 
        super(name);
        this.department = department;
    }
    
    public getElevatorPitch () {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee ("Howard", "Sales");
console.log(howard.getElevatorPitch());
//console.log(howard.name);

class Octopus {
    readonly name: string;
    readonly numberOfLegs = 8;

    constructor (theName: string) {
        this.name = theName;
    }
}

let dad  = new Octopus ("Man with the 8 strong legs");

console.log(dad);

class Employer {
    fullName: string;
}

let employer = new Employer ();

employer.fullName = "Bob Smith";

if (employer.fullName) {
    console.log(employer.fullName);
}

let passcode = "secret passcode";

class Player {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode === "..secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthenticated update of employer!")
        }
    }
}

let p = new Player ();

p.fullName = "Bob Smith";

if (p.fullName) {
    console.log(p.fullName);
}

class Grid {
    static origin = { x: 0, y: 0 };

    calculateDistanceFromOrigin ( point: { x: number, y: number } ) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);

        return Math.sqrt( xDist * xDist + yDist * yDist ) / this.scale;
    }

    constructor ( public scale: number ) {};
}

let grid1 = new Grid(1.0);
let grid2 = new Grid(2.0);

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));

// Abstract Classes
//
abstract class Department {
    constructor ( public name: string ) {}

    printName (): void {
        console.log("Department name: " + this.name);
    }

    abstract printMeeting (): void; // 在派生类中必须实现此方法
}

class AccountingDepartment extends Department {
    constructor () {
        super ("Accounting and Auditing"); // 派生类中的构建器必须调用 `super()` 方法
    }
    
    printMeeting (): void {
        console.log ("The Accounting Department meets each Monday @10am.");
    }

    generateReports (): void {
        console.log ("Generating accounting reports...");
    }
}

let department: Department; // 创建一个到抽象类型的引用是没有问题的
department = new Department (); // 报错： 无法创建某个抽象类的实例
department = new AccountingDepartment(); // 创建非抽象子类的实例并为其赋值，没有问题
department.printName();
department.printMeeting();
department.generateReports(); // 报错：该方法并不存在与所声明的抽象类型上

