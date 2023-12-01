import * as THREE from "three";

class Visitor{
    constructor(name, target){
        this.name = name;
        this.target = Target.target
    }
    
    
}

class Target{

    //обычное купание
    //купание с пузырьками
    //купание с пеной
    //купание с пеной и пузырьками
    //купание с массажем

    static bathing = new Target("bathing")
    static bathingWithBubbles = new Target("bathing with bubbles")
    static foamBathing = new Target("foam bathing")
    static bathingWithFoamAndBubbles = new Target("bathing with foam and bubbles")
    static bathingWithMassage = new Target("bathing with massage")

    constructor(target){
        this.target = target
    }
}