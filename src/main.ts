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
console.log(howard.name);

