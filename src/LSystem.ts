
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

     // Set up instanced rendering data arrays here.
     offsetsArray: number[];
     colorsArray: number[];

    // The transformation matrix to pass to the instancing shader
    col0: number[];
    col1: number[];
    col2: number[];
    col3: number[];

    numCylinders: number;


    constructor()
    {
        this.turtleArr = [];
        this.grammarString = ["F", "G", "F", "G", "G", "F"];
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


    // Turn the grammar into position and orientation
    // data for drawing
    computeDrawingData()
    {
        /*
        let rows: number = 1.0;
        let cols: number = 1.0;

        for(let i = 0; i < rows * cols; i++)
        {
            colorsArray.push(i / rows);
            colorsArray.push(i / cols);
            colorsArray.push(1.0);
            colorsArray.push(1.0); // Alpha channel
        }

        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
            offsetsArray.push(i * 1.0);
            offsetsArray.push(j * 1.0);
            offsetsArray.push(0);
            }
        }
        */        
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

        let currPos: vec4 = vec4.fromValues(0.0, 0.0, 0.0, 1.0);

        let currDirection: vec4 = vec4.fromValues(0.0, 1.0, 0.0, 0.0);

        let straight: mat4 = mat4.create();

        let zAxis: vec3 = vec3.fromValues(0.0, 0.0, 1.0);

        let theta: number = 3.14159 / 8.0;

        let rotAboutZ = mat4.create();

        mat4.fromRotation(rotAboutZ, theta, zAxis);

        let drawF: DrawingRule = new DrawingRule(4.0, straight);

        let drawG: DrawingRule = new DrawingRule(4.0, rotAboutZ);

        let transformMat: mat4 = mat4.create();

        for(let c in this.grammarString)
        {
            if(this.grammarString[c] == "F")
            {
            // Change currDirection
            currDirection = drawF.returnNewDirection(currDirection);
            vec4.scaleAndAdd(currPos, currPos, currDirection, drawF.forwardAmount);
            mat4.mul(transformMat, transformMat, drawF.orientationMat);
            }
            else if(this.grammarString[c] == "G")
            {
            currDirection = drawG.returnNewDirection(currDirection);
            vec4.scaleAndAdd(currPos, currPos, currDirection, drawG.forwardAmount);
            mat4.mul(transformMat, transformMat, drawG.orientationMat);
            }

            this.col0.push(transformMat[0]);
            this.col0.push(transformMat[1]);
            this.col0.push(transformMat[2]);
            this.col0.push(transformMat[3]);

            this.col1.push(transformMat[4]);
            this.col1.push(transformMat[5]);
            this.col1.push(transformMat[6]);
            this.col1.push(transformMat[7]);

            this.col2.push(transformMat[8]);
            this.col2.push(transformMat[9]);
            this.col2.push(transformMat[10]);
            this.col2.push(transformMat[11]);

            this.col3.push(transformMat[12]);
            this.col3.push(transformMat[13]);
            this.col3.push(transformMat[14]);
            this.col3.push(transformMat[15]);



            this.offsetsArray.push(currPos[0]);
            this.offsetsArray.push(currPos[1]);
            this.offsetsArray.push(currPos[2]);
            this.numCylinders++;
        }
        
        
        for(let i = 0; i < this.numCylinders; i++)
        {
            this.colorsArray.push(1.0);
            this.colorsArray.push(0.0);
            this.colorsArray.push(0.0);
            this.colorsArray.push(1.0); // Alpha channel
        }
    }

}