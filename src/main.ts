import {vec3, vec4, mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import Cube from './geometry/Cube';
import DrawingRule from './DrawingRule';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
};

let square: Square;
let cube: Cube;
let screenQuad: ScreenQuad;
let time: number = 0.0;

function loadScene() {
  square = new Square();
  square.create();
  cube = new Cube();
  cube.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();

  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU
  let offsetsArray: number[] = [];
  let colorsArray: number[] = [];
  
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

  
  let numCylinders: number = 1.0;
  
  offsetsArray.push(0.0);
  offsetsArray.push(0.0);
  offsetsArray.push(0.0);
  

  let currPos: vec4 = vec4.fromValues(0.0, 0.0, 0.0, 1.0);

  let currDirection: vec4 = vec4.fromValues(0.0, 1.0, 0.0, 0.0);

  let straight: mat4 = mat4.create();

  let drawF: DrawingRule = new DrawingRule(2.0, straight);

  let demoString: string[]= ["F", "F", "F", "F", "F",];

  for(let c in demoString)
  {
    if(demoString[c] == "F")
    {
      // Move currPos forward according to the drawing rule
      currPos = drawF.returnNewPoint(currPos, currDirection);
      offsetsArray.push(currPos[0]);
      offsetsArray.push(currPos[1]);
      offsetsArray.push(currPos[2]);
      numCylinders++;
    }
  }
  
  
  for(let i = 0; i < numCylinders; i++)
  {
      colorsArray.push(1.0);
      colorsArray.push(0.0);
      colorsArray.push(0.0);
      colorsArray.push(1.0); // Alpha channel
  }
  


  let offsets: Float32Array = new Float32Array(offsetsArray);
  let colors: Float32Array = new Float32Array(colorsArray);

  square.setInstanceVBOs(offsets, colors);
  square.setNumInstances(numCylinders); // grid of "particles"

  cube.setInstanceVBOs(offsets, colors);
  cube.setNumInstances(numCylinders); // grid of "particles"
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 0, 20), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.ONE, gl.ONE); // Additive blending

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);

    //renderer.render(camera, instancedShader, [square,]);
    renderer.render(camera, instancedShader, [cube,]);

    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
