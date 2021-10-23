
import {vec3, vec4} from 'gl-matrix';

class Turtle
{
    position: vec3;
    orientationAxis: vec3;
    orientationAngle: number;
    recursionDepth: number;

    constructor(posIn: vec3, orientationAxisIn: vec3, 
        orientationAngleIn: number, recursionDepthIn: number) 
    {
        this.position = vec3.fromValues(posIn[0], posIn[1], posIn[2]);

        this.orientationAxis = vec3.fromValues(orientationAxisIn[0], 
                                                orientationAxisIn[1],
                                                orientationAxisIn[2]);

        this.orientationAngle = orientationAngleIn;
        this.recursionDepth = recursionDepthIn;
    }
}


