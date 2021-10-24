
import {vec3, vec4} from 'gl-matrix';

export default class Turtle
{
    position: vec3;
    orientation: vec3;
    recursionDepth: number;

    constructor(posIn: vec3, orientationIn: vec3,  recursionDepthIn: number) 
    {
        this.position = vec3.fromValues(posIn[0], posIn[1], posIn[2]);

        this.orientation = vec3.fromValues(orientationIn[0], 
                                                orientationIn[1],
                                                orientationIn[2]);

        this.recursionDepth = recursionDepthIn;
    }

    moveForward(forwardAmount: number) 
    {
        vec3.scaleAndAdd(this.position, this.position, this.orientation, forwardAmount);
    }
}


