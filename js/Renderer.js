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
	    this.imageData.data[index + 0] = r;
	    this.imageData.data[index + 1] = g;
	    this.imageData.data[index + 2] = b;
	    this.imageData.data[index + 3] = a;
	}

	setPerspectiveMatrix(pMatrix) {
		this.pMatrix = pMatrix;
	}
}