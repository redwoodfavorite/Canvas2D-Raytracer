ASPECTRATIO = [200, 200];

var tempMv;
var mvMatrix;
var renderer;
function initRayTracer () {
	var canvas;
	var pMatrix;
	var triangles;

	//////////////////////////////////////
	// CREATE CANVAS
	//////////////////////////////////////

	canvas        = document.querySelector('canvas');
	canvas.width  = ASPECTRATIO[0];
	canvas.height = ASPECTRATIO[1];
	context       = canvas.getContext('2d');

	//////////////////////////////////////
	// CREATE WORLD
	//////////////////////////////////////

	renderer = new Renderer(context, ASPECTRATIO);

	triangles = [
	    	[
				// Front face
				vec3.set(vec3.create(), -1.0, -1.0,  1.0),
				vec3.set(vec3.create(),  1.0, -1.0,  1.0),
				vec3.set(vec3.create(),  1.0,  1.0,  1.0),
			],[
				vec3.set(vec3.create(), -1.0, -1.0,  1.0),
				vec3.set(vec3.create(), -1.0,  1.0,  1.0),
				vec3.set(vec3.create(),  1.0,  1.0,  1.0)
			],[
				// Back face
				vec3.set(vec3.create(), -1.0, -1.0, -1.0),
				vec3.set(vec3.create(), -1.0,  1.0, -1.0),
				vec3.set(vec3.create(),  1.0,  1.0, -1.0),
			],[
				vec3.set(vec3.create(), -1.0, -1.0, -1.0),
				vec3.set(vec3.create(),  1.0,  1.0, -1.0),
				vec3.set(vec3.create(),  1.0, -1.0, -1.0),
			],[
				// Top face
				vec3.set(vec3.create(), -1.0,  1.0, -1.0),
				vec3.set(vec3.create(), -1.0,  1.0,  1.0),
				vec3.set(vec3.create(),  1.0,  1.0,  1.0),
			],[
				vec3.set(vec3.create(), -1.0,  1.0, -1.0),
				vec3.set(vec3.create(),  1.0,  1.0,  1.0),
				vec3.set(vec3.create(),  1.0,  1.0, -1.0),
			],[
				// Bottom face
				vec3.set(vec3.create(), -1.0, -1.0, -1.0),
				vec3.set(vec3.create(),  1.0, -1.0, -1.0),
				vec3.set(vec3.create(),  1.0, -1.0,  1.0),
			],[
				vec3.set(vec3.create(), -1.0, -1.0, -1.0),
				vec3.set(vec3.create(),  1.0, -1.0,  1.0),
				vec3.set(vec3.create(), -1.0, -1.0,  1.0),
			],[
				// Right face
				vec3.set(vec3.create(),  1.0, -1.0, -1.0),
				vec3.set(vec3.create(),  1.0,  1.0, -1.0),
				vec3.set(vec3.create(),  1.0,  1.0,  1.0),
			],[
				vec3.set(vec3.create(),  1.0, -1.0, -1.0),
				vec3.set(vec3.create(),  1.0,  1.0,  1.0),
				vec3.set(vec3.create(),  1.0, -1.0,  1.0),
			],[   
	      		// Left face
				vec3.set(vec3.create(), -1.0, -1.0, -1.0),
				vec3.set(vec3.create(), -1.0, -1.0,  1.0),
				vec3.set(vec3.create(), -1.0,  1.0,  1.0),
			],[
				vec3.set(vec3.create(), -1.0, -1.0, -1.0),
				vec3.set(vec3.create(), -1.0,  1.0,  1.0),
				vec3.set(vec3.create(), -1.0,  1.0, -1.0),
			]
		];
	// triangles = [
	// 	[
	// 		vec3.set(vec3.create(), -0.5,  0.5,  0.0),
	// 		vec3.set(vec3.create(),  0.5,  0.5,  0.0),
	// 		vec3.set(vec3.create(),  0.0, -0.5,  0.0)
	// 	]
	// ];

	mvMatrix = mat4.create();
	tempMv   = mat4.create();

	renderer.addObject({
		triangles: triangles,
		mvMatrix: mvMatrix
	});

	pMatrix = mat4.perspective(mat4.create(), Math.PI / 3, ASPECTRATIO[0] / ASPECTRATIO[1], 0.0, 100.0);
	renderer.setPerspectiveMatrix(pMatrix);

	//////////////////////////////////////
	// START RENDER LOOP
	//////////////////////////////////////

	tick();
}

var rotation         = 0;
var rotationVector   = vec3.set(vec3.create(), 0, 1, 1);
var tempPos          = vec3.create();
var trianglePosition = vec3.set(tempPos, 0, 0, -10.0);

function animate () {
	rotation += 0.01;
	vec3.set(tempPos, 0, 0, -10.0 + (Math.sin(Date.now() * .001) * 5.0));
	mat4.identity(tempMv);
	mvMatrix = mat4.translate(mvMatrix, tempMv, trianglePosition);
	mat4.rotate(tempMv, mvMatrix, rotation, rotationVector);
	mat4.copy(mvMatrix, tempMv);
}

function tick () {
	requestAnimationFrame(tick);
	animate();
	renderer.draw();
}

class Renderer {
	constructor(context, size) {
		this.context   = context;
		this.width     = size[0];
		this.height    = size[1];

		this.imageData = context.createImageData(
			this.width,
			this.height
		);

		this.registeredObjects    = [];
		this.objectsAtPixel       = [];
		this.pixelPos             = [];
		this.transformedTriangles = [];

		// temporary matrix
		this.multiplied = mat4.create();
	}

	addObject(object) {
		var objIndex = this.registeredObjects.length;
		var vertex;
		var i;
		var k;

		this.registeredObjects.push(object);
		this.transformedTriangles[objIndex] = [];

		for (i = 0; i < object.triangles.length; i++) {
			this.transformedTriangles[objIndex][i] = [];
			for (k = 0; k < 3; k++) {
				this.transformedTriangles[objIndex][i][k] = vec3.create();
			}
		}
	}

	transformVertices() {
		var mvMatrix;
		var numObjects = this.registeredObjects.length;
		var numTriangles;
		var objectTriangles;
		for (var i = 0; i < numObjects; i++) {
			objectTriangles = this.registeredObjects[i].triangles;
			numTriangles    = objectTriangles.length;
			mvMatrix        = this.registeredObjects[i].mvMatrix;
			mat4.multiply(this.multiplied, this.pMatrix, mvMatrix);
			for (var j = 0; j < numTriangles; j++) {
				for (var k = 0; k < 3; k++) {
					// i = object
					// j = triangle
					// k = vertex
					vec3.transformMat4(this.transformedTriangles[i][j][k], objectTriangles[j][k], this.multiplied);
				}
			}
		}
	}

	draw() {
		this.transformVertices();

		for (var i = 0; i < this.height; i++) {
			for (var j = 0; j < this.width; j++) {
				if(this.objectExistsAtPixel(j, i)){
					this.setPixel(j, i, 255, 255, 255, 255);
				}
				else {
					this.setPixel(j, i, 0, 0, 0, 255);
				}
			}
		}

		this.context.putImageData(this.imageData, 0, 0);
	}

	objectExistsAtPixel(x, y) {
		this.pixelPos = [
			(x - this.width * 0.5) / this.width,
			(y - this.height * 0.5) / this.height
		];

		for (var i = 0; i < this.transformedTriangles.length; i++) {
			var objectTriangles = this.transformedTriangles[i];
			for (var j = 0; j < objectTriangles.length; j++) {
			    var b1 = this.sign(this.pixelPos, objectTriangles[j][0], objectTriangles[j][1]) < 0.0;
			    var b2 = this.sign(this.pixelPos, objectTriangles[j][1], objectTriangles[j][2]) < 0.0;
			    var b3 = this.sign(this.pixelPos, objectTriangles[j][2], objectTriangles[j][0]) < 0.0;

				if ((b1 === b2) && (b2 === b3)) return true;
			}
		}

		return false;
	}

	sign(p1, p2, p3) {
		return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
	}

	setPixel(x, y, r, g, b, a) {
	    var index = (x + y * this.imageData.width) * 4;
	    this.imageData.data[index+0] = r;
	    this.imageData.data[index+1] = g;
	    this.imageData.data[index+2] = b;
	    this.imageData.data[index+3] = a;
	}

	setPerspectiveMatrix(pMatrix) {
		this.pMatrix = pMatrix;
	}
}

class Cube {
	constructor(options) {
		this.triangles = [
	    	[
				// Front face
				[-1.0, -1.0,  1.0],
				[ 1.0, -1.0,  1.0],
				[ 1.0,  1.0,  1.0],
				[-1.0,  1.0,  1.0],
			],
	    	[
				// Back face
				[-1.0, -1.0, -1.0],
				[-1.0,  1.0, -1.0],
				[ 1.0,  1.0, -1.0],
				[ 1.0, -1.0, -1.0],
			],
	    	[
				// Top face
				[-1.0,  1.0, -1.0],
				[-1.0,  1.0,  1.0],
				[ 1.0,  1.0,  1.0],
				[ 1.0,  1.0, -1.0],
			],
	    	[
				// Bottom face
				[-1.0, -1.0, -1.0],
				[ 1.0, -1.0, -1.0],
				[ 1.0, -1.0,  1.0],
				[-1.0, -1.0,  1.0],
			],
	    	[
				// Right face
				[ 1.0, -1.0, -1.0],
				[ 1.0,  1.0, -1.0],
				[ 1.0,  1.0,  1.0],
				[ 1.0, -1.0,  1.0],
			],
	      	[   // Left face
				[-1.0, -1.0, -1.0],
				[-1.0, -1.0,  1.0],
				[-1.0,  1.0,  1.0],
				[-1.0,  1.0, -1.0],
			]
		];
	}
}

window.onload = initRayTracer;