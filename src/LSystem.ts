
import {vec3, vec4, mat4} from 'gl-matrix';
import ExpansionRule from "./ExpansionRule";
import DrawingRule from "./DrawingRule";
import Turtle from "./Turtle";

export default class LSystem
{
    grammarString: string[];
    turtleArr: Turtle[];
    axiomString: string;
    currTurtle: number;

    currPos: vec4;
    currDirection: vec4;
    currTransformMat: mat4;

    numIterations: number;

    theta: number;

    // Set up instanced rendering data arrays here.
    offsetsArray: number[];
    colorsArray: number[];

    // The transformation matrix to pass to the instancing shader
    col0: number[];
    col1: number[];
    col2: number[];
    col3: number[];

    numCylinders: number;

    currRecursionLevel: number;

    
    drawRules: Map<string, any>;

    expansionRules: Map<string, ExpansionRule>;


    constructor(angle: number)
    {
        this.drawRules = new Map();
        this.drawRules.set('F', this.moveForward.bind(this));

        this.drawRules.set('+Z', this.rotateLeftZ.bind(this));
        this.drawRules.set('-Z', this.rotateRightZ.bind(this));

        this.drawRules.set('+X', this.rotateLeftX.bind(this));
        this.drawRules.set('-X', this.rotateRightX.bind(this));

        this.drawRules.set('+Y', this.rotateLeftY.bind(this));
        this.drawRules.set('-Y', this.rotateRightY.bind(this));


        this.drawRules.set('[', this.storeTurtle.bind(this));

        this.drawRules.set(']', this.loadTurtle.bind(this));

        this.expansionRules = new Map();

        let expandRuleF = new ExpansionRule("F", ["F", "F", "-",
                                             "[", "-", "F", "+", 
                                             "F", "]", "+", "[", 
                                             "+", "F", "-", "F", "]"]);
        this.expansionRules.set("F", expandRuleF);


        this.currRecursionLevel = 1;

        this.currPos = vec4.fromValues(0.0, 0.0, 0.0, 1.0);

        this.currDirection = vec4.fromValues(0.0, 1.0, 0.0, 0.0);
    
        this.currTransformMat = mat4.create();

        this.theta = angle;

        this.numIterations = 3;

        let startingTurtle = new Turtle(vec3.fromValues(0.0, 0.0, 0.0), 
                                        vec3.fromValues(0.0, 1.0, 0.0), 
                                        1,
                                        mat4.create());

        this.turtleArr = [startingTurtle];
        this.grammarString = ["F", "F", "-Z", "[", "-Z", "F", "+Z", 
                                "F", "]", "+X", "[", "+Z", "F", "-Z", 
                                "F", "]"];
        this.axiomString = "F";
        this.currTurtle = 0;

        this.offsetsArray = [];
        this.colorsArray = [];

        this.col0 = [];
        this.col1 = [];
        this.col2 = [];
        this.col3 = [];

        this.numCylinders = 1;
    }


    expand()
    {
        let outStringArr: string[] = [];
        let stringArr: string[] = [];
        for(let i = 0; i < this.numIterations; i++)
        {
            for(let c in this.grammarString)
            {
                let currRule = this.expansionRules.get(this.grammarString[c]);
                if(currRule)
                {
                    stringArr = currRule.outputString;
                    for(let s in stringArr)
                    {
                        outStringArr.push(stringArr[s]);
                    }
                }
                else
                outStringArr.push(this.grammarString[c]);
            }
        }

        this.grammarString = outStringArr;
    }


    // Turn the grammar into position and orientation
    // data for drawing
    computeDrawingData()
    {       
        // Always draw 1 object
        this.offsetsArray.push(0.0);
        this.offsetsArray.push(0.0);
        this.offsetsArray.push(0.0);

        this.col0.push(1.0);
        this.col0.push(0.0);
        this.col0.push(0.0);
        this.col0.push(0.0);

        this.col1.push(0.0);
        this.col1.push(1.0);
        this.col1.push(0.0);
        this.col1.push(0.0);

        this.col2.push(0.0);
        this.col2.push(0.0);
        this.col2.push(1.0);
        this.col2.push(0.0);

        this.col3.push(0.0);
        this.col3.push(0.0);
        this.col3.push(0.0);
        this.col3.push(1.0);

        for(let c in this.grammarString)
        {
            let draw: boolean = true;
            let currString: string = this.grammarString[c];
            let func = this.drawRules.get(currString);
            if(func)
            {
               draw = func();
            }

            if(draw)
            {
                this.col0.push(this.currTransformMat[0]);
                this.col0.push(this.currTransformMat[1]);
                this.col0.push(this.currTransformMat[2]);
                this.col0.push(this.currTransformMat[3]);

                this.col1.push(this.currTransformMat[4]);
                this.col1.push(this.currTransformMat[5]);
                this.col1.push(this.currTransformMat[6]);
                this.col1.push(this.currTransformMat[7]);

                this.col2.push(this.currTransformMat[8]);
                this.col2.push(this.currTransformMat[9]);
                this.col2.push(this.currTransformMat[10]);
                this.col2.push(this.currTransformMat[11]);

                this.col3.push(this.currTransformMat[12]);
                this.col3.push(this.currTransformMat[13]);
                this.col3.push(this.currTransformMat[14]);
                this.col3.push(this.currTransformMat[15]);

                this.offsetsArray.push(this.currPos[0]);
                this.offsetsArray.push(this.currPos[1]);
                this.offsetsArray.push(this.currPos[2]);
                this.numCylinders++;
            }
        }
        
        
        for(let i = 0; i < this.numCylinders; i++)
        {
            this.colorsArray.push(1.0);
            this.colorsArray.push(0.0);
            this.colorsArray.push(0.0);
            this.colorsArray.push(1.0); // Alpha channel
        }
    }

    moveForward(): boolean
    {
        let straight: mat4 = mat4.create();
        let moveForwardRule = new DrawingRule(4.0, straight);
        this.currDirection = moveForwardRule.returnNewDirection(this.currDirection);
        vec4.scaleAndAdd(this.currPos, this.currPos, this.currDirection, moveForwardRule.forwardAmount);
        mat4.mul(this.currTransformMat, this.currTransformMat, moveForwardRule.orientationMat);
        return true;
    }

    rotateLeftZ(): boolean
    {
        let zAxis: vec3 = vec3.fromValues(0.0, 0.0, 1.0);
        let rotAboutZ = mat4.create();
        mat4.fromRotation(rotAboutZ, this.theta, zAxis);
        let rotateAboutZ = new DrawingRule(4.0, rotAboutZ);
        this.currDirection = rotateAboutZ.returnNewDirection(this.currDirection);
        vec4.scaleAndAdd(this.currPos, this.currPos, this.currDirection, rotateAboutZ.forwardAmount);
        mat4.mul(this.currTransformMat, this.currTransformMat, rotateAboutZ.orientationMat);
        return true;
    }

    rotateRightZ(): boolean
    {
        let zAxis: vec3 = vec3.fromValues(0.0, 0.0, 1.0);
        let rotAboutZ = mat4.create();
        mat4.fromRotation(rotAboutZ, -this.theta, zAxis);
        let rotateAboutZ = new DrawingRule(4.0, rotAboutZ);
        this.currDirection = rotateAboutZ.returnNewDirection(this.currDirection);
        vec4.scaleAndAdd(this.currPos, this.currPos, this.currDirection, rotateAboutZ.forwardAmount);
        mat4.mul(this.currTransformMat, this.currTransformMat, rotateAboutZ.orientationMat);
        return true;
    }


    rotateLeftX(): boolean
    {
        let zAxis: vec3 = vec3.fromValues(1.0, 0.0, 0.0);
        let rotAboutZ = mat4.create();
        mat4.fromRotation(rotAboutZ, this.theta, zAxis);
        let rotateAboutZ = new DrawingRule(4.0, rotAboutZ);
        this.currDirection = rotateAboutZ.returnNewDirection(this.currDirection);
        vec4.scaleAndAdd(this.currPos, this.currPos, this.currDirection, rotateAboutZ.forwardAmount);
        mat4.mul(this.currTransformMat, this.currTransformMat, rotateAboutZ.orientationMat);
        return true;
    }

    rotateRightX(): boolean
    {
        let zAxis: vec3 = vec3.fromValues(1.0, 0.0, 0.0);
        let rotAboutZ = mat4.create();
        mat4.fromRotation(rotAboutZ, -this.theta, zAxis);
        let rotateAboutZ = new DrawingRule(4.0, rotAboutZ);
        this.currDirection = rotateAboutZ.returnNewDirection(this.currDirection);
        vec4.scaleAndAdd(this.currPos, this.currPos, this.currDirection, rotateAboutZ.forwardAmount);
        mat4.mul(this.currTransformMat, this.currTransformMat, rotateAboutZ.orientationMat);
        return true;
    }


    rotateLeftY(): boolean
    {
        let zAxis: vec3 = vec3.fromValues(0.0, 1.0, 0.0);
        let rotAboutZ = mat4.create();
        mat4.fromRotation(rotAboutZ, this.theta, zAxis);
        let rotateAboutZ = new DrawingRule(4.0, rotAboutZ);
        this.currDirection = rotateAboutZ.returnNewDirection(this.currDirection);
        vec4.scaleAndAdd(this.currPos, this.currPos, this.currDirection, rotateAboutZ.forwardAmount);
        mat4.mul(this.currTransformMat, this.currTransformMat, rotateAboutZ.orientationMat);
        return true;
    }

    rotateRightY(): boolean
    {
        let zAxis: vec3 = vec3.fromValues(0.0, 1.0, 0.0);
        let rotAboutZ = mat4.create();
        mat4.fromRotation(rotAboutZ, -this.theta, zAxis);
        let rotateAboutZ = new DrawingRule(4.0, rotAboutZ);
        this.currDirection = rotateAboutZ.returnNewDirection(this.currDirection);
        vec4.scaleAndAdd(this.currPos, this.currPos, this.currDirection, rotateAboutZ.forwardAmount);
        mat4.mul(this.currTransformMat, this.currTransformMat, rotateAboutZ.orientationMat);
        return true;
    }


    storeTurtle(): boolean
    {
        this.currRecursionLevel++;
        let scaleFactor: number = 1.0 - (this.currRecursionLevel / 100.0);

        
        this.currTransformMat[0] *= scaleFactor;
        this.currTransformMat[5] *= scaleFactor;
        this.currTransformMat[10] *= scaleFactor;
        
        
        let newTurtle: Turtle = new Turtle(vec3.fromValues(this.currPos[0], this.currPos[1], this.currPos[2]), 
                                            vec3.fromValues(this.currDirection[0], this.currDirection[1], this.currDirection[2]), 
                                                this.currRecursionLevel, this.currTransformMat);
        this.turtleArr.push(newTurtle);
        return false;
    }

    loadTurtle(posIn: vec3, directionIn: vec3, 
        transformMat: mat4, currRecursionDepth: number): boolean
    {
        let currTurtle: Turtle = this.turtleArr.pop();
        let currTurPos: vec3 = currTurtle.position;
        this.currPos = vec4.fromValues(currTurPos[0], currTurPos[1], currTurPos[2], 1.0);
        let currTurDir: vec3 = currTurtle.orientation;
        this.currDirection = vec4.fromValues(currTurDir[0], currTurDir[1], currTurDir[2], 1.0);
    
        this.currTransformMat = currTurtle.transform;
        this.currRecursionLevel = currTurtle.recursionDepth;

        return false;
    }

}

