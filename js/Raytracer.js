ASPECTRATIO = [200, 200];

var tempMv;
var mvMatrix;
var renderer;
var cube;

function initRaytracer () {
	var canvas;
	var pMatrix;
	var triangles;

	/* Get context & size canvas */

	canvas                = document.querySelector('canvas');
	canvas.width          = ASPECTRATIO[0];
	canvas.height         = ASPECTRATIO[1];
	canvas.style.position = 'absolute';
	canvas.style.top      = innerHeight * 0.5 - ASPECTRATIO[1] * 0.5;
	canvas.style.left     = innerWidth * 0.5 - ASPECTRATIO[0] * 0.5;
	context               = canvas.getContext('2d');

	/* Create renderer */

	renderer = new Renderer(context, ASPECTRATIO);

	/* Add cube */

	var tempPos          = vec3.create();
	var trianglePosition = vec3.set(vec3.create(), 0, 0, -10.0);
	var axisOfRotation   = vec3.set(vec3.create(), 0, 1, 1);

	cube = new Cube();
	renderer.addObject(cube);

	/* Set perspective */

	pMatrix = mat4.perspective(mat4.create(), Math.PI / 3, ASPECTRATIO[0] / ASPECTRATIO[1], 50.0, 100.0);
	renderer.setPerspectiveMatrix(pMatrix);

	/* Start render loop */

	tick();
}

var translation;
var rotation         = 0.4;
var tempPos          = vec3.create();
var trianglePosition = vec3.set(tempPos, 0, 0, -10.0);
function animate () {
	rotation += 0.01;
	cube.identity();
	// cube.translate(0, 0, -4.3);
	cube.translate(0, 0, -10.0 + (Math.sin(Date.now() * .001) * 5.0));
	cube.rotate(rotation, 0, 1, 1);
}

function tick () {
	requestAnimationFrame(tick);
	animate();
	renderer.draw();
}

window.onload = initRaytracer;