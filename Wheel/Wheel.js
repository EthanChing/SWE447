var canvas;
var gl;



var Wheels = {
  Rim : undefined,
  Wheel : undefined,

};

// Viewing transformation parameters
var V;  // matrix storing the viewing transformation

// Projection transformation parameters
var P;  // matrix storing the projection transformation
var near = 1;      // near clipping plane's distance
var far = 450;      // far clipping plane's distance

// Animation variables
var time = 0.0;      // time, our global time constant, which is 
                     // incremented every frame
var timeDelta = 0.5; // the amount that time is updated each fraime

//---------------------------------------------------------------------------
//
//  init() - scene initialization function
//

function init() {
  canvas = document.getElementById("webgl-canvas");

  // Configure our WebGL environment
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL initialization failed"); }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);


  for (var name in Wheels ) {

    var wheel = Wheels[name] = new Sphere();


    wheel.uniforms = { 
      color : gl.getUniformLocation(wheel.program, "color"),
      MV : gl.getUniformLocation(wheel.program, "MV"),
      P : gl.getUniformLocation(wheel.program, "P"),
    };
  }

  resize();

  window.requestAnimationFrame(render);  
}

//---------------------------------------------------------------------------
//
//  render() - render the scene
//

function render() {
  time += timeDelta;

  var ms = new MatrixStack();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  V = translate(0.0, 0.0, -0.5*(near + far));
  ms.load(V);  


  var name, wheel, data, name1, name2, name3, name4, name5, name6, name7, name8, name9, name10;

  name = "Wheel";
  wheel = Wheel[name];
  data = Wheels[name];
  

  wheel.PointMode = false;

  ms.push();
  ms.scale(data.radius);
  gl.useProgram(wheel.program);
  gl.uniformMatrix4fv(wheel.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(wheel.uniforms.P, false, flatten(P));
  gl.uniform4fv(wheel.uniforms.color, flatten(data.color));
  wheel.render();
  ms.pop();


  
  name1 = "Rim";
  wheel = Wheel[name1];
  data = Wheels[name1];
  
  wheel.PointMode = false;
  
  ms.push();
  ms.rotate((1/data.year)*time, [0, 0, 1]);
  ms.translate(data.distance, 0, 0);
  ms.push();
  ms.scale(data.radius);
  gl.useProgram(wheel.program);
  gl.uniformMatrix4fv(wheel.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(wheel.uniforms.P, false, flatten(P));
  gl.uniform4fv(wheel.uniforms.color, flatten(data.color));
  wheel.render();
  ms.pop();
  
 
  
  window.requestAnimationFrame(render);
}

//---------------------------------------------------------------------------
//
//  resize() - handle resize events
//

function resize() {
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;

  gl.viewport(0, 0, w, h);

  var fovy = 120.0; // degrees
  var aspect = w / h;

  P = perspective(fovy, aspect, near, far);
}

//---------------------------------------------------------------------------
//
//  Window callbacks for processing various events
//

window.onload = init;
window.onresize = resize;
