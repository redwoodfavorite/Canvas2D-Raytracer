class Renderer {
	constructor(context, size) {
		this.context = context;
		this.width   = size[0];
		this.height  = size[1];

		this.imageData = context.createImageData(
			this.width,
			this.height
		);

		this.registeredObjects          = [];
		this.objectsAtPixel             = [];
		this.pixelPos                   = [];
		this.transformedVertexPositions = [];
		this.attribs                    = [];

		// temporaries
		this.multiplied     = mat4.create();
		this.distanceVector = vec3.create();
		this.scaled         = [
			vec3.create(),
			vec3.create(),
			vec3.create()
		];

		this.summed = [
			vec3.create(),
			vec3.create()
		];

		this.targetTriangle = [];

		this.vectorSum1 = vec3.create();
		this.vectorSum2 = vec3.create();
	}

	addObject(object) {
		var objIndex = this.registeredObjects.length;
		var vertices;
		var i;
		var k;

		this.registeredObjects.push(object);
		this.transformedVertexPositions[objIndex] = [];

		for (i = 0; i < object.triangles.length; i++) {
			vertices = object.triangles[i].vertices;
			this.transformedVertexPositions[objIndex][i] = [];
			for (k = 0; k < 3; k++) {
				this.transformedVertexPositions[objIndex][i][k] = vec3.create();
			}
		}
	}

	transformVertices() {
		var mvMatrix;
		var numObjects = this.registeredObjects.length;
		var numTriangles;
		var triangles;
		for (var i = 0; i < numObjects; i++) {
			triangles        = this.registeredObjects[i].triangles;
			numTriangles     = triangles.length;
			mvMatrix         = this.registeredObjects[i].mvMatrix;

			mat4.multiply(this.multiplied, this.pMatrix, mvMatrix);
			for (var j = 0; j < numTriangles; j++) {
				for (var k = 0; k < 3; k++) {
					// i = object
					// j = triangle
					// k = vertex
					vec3.transformMat4(this.transformedVertexPositions[i][j][k], triangles[j].vertices[k], this.multiplied);
				}
			}
		}
	}

	draw() {
		this.transformVertices();

		var color;
		var triangle;
		for (var i = 0; i < this.height; i++) {
			for (var j = 0; j < this.width; j++) {
				this.pixelPos[0] = (j - this.width  * 0.5)  / this.width;
				this.pixelPos[1] = (i - this.height * 0.5) / this.height;

				triangle = this.getTriangleAtPixel();

				if(triangle){
					color = this.getInterpolatedValue('colors', this.targetTriangle);
					this.setPixel(j, i, color[0], color[1], color[2], 255);
				}
				else {
					this.setPixel(j, i, 0, 0, 0, 255);
				}
			}
		}

		this.context.putImageData(this.imageData, 0, 0);
	}

	getInterpolatedValue(attribute, triangleIndex) {
		var triangle         = this.registeredObjects[triangleIndex[0]].triangles[triangleIndex[1]];
		var triangleVertices = this.transformedVertexPositions[triangleIndex[0]][triangleIndex[1]];

		var distance0 = vec2.distance(this.pixelPos, triangleVertices[0]),
			distance1 = vec2.distance(this.pixelPos, triangleVertices[1]),
			distance2 = vec2.distance(this.pixelPos, triangleVertices[2]);

		var sum      = (1/ distance0) + (1/ distance1) + (1/ distance2);
		this.weight0 = (1/ distance0) / sum;
		this.weight1 = (1/ distance1) / sum;
		this.weight2 = (1/ distance2) / sum;
		// if(this.pixelPos[0] === 0.48 && this.pixelPos[1] === -0.48) debugger;

		vec3.scale(this.scaled[0], triangle[attribute][0], this.weight0);
		vec3.scale(this.scaled[1], triangle[attribute][1], this.weight1);
		vec3.scale(this.scaled[2], triangle[attribute][2], this.weight2);

		return vec3.add(this.summed[0], this.scaled[0], vec3.add(this.summed[1], this.scaled[1], this.scaled[2]));
	}

	getInterpolatedDepth(triangleVertices) {
		var distance0 = vec2.distance(this.pixelPos, triangleVertices[0]),
			distance1 = vec2.distance(this.pixelPos, triangleVertices[1]),
			distance2 = vec2.distance(this.pixelPos, triangleVertices[2]);

		var sum      = (1/ distance0) + (1/ distance1) + (1/ distance2);
		this.weight0 = (1/ distance0) / sum;
		this.weight1 = (1/ distance1) / sum;
		this.weight2 = (1/ distance2) / sum;

		var z1 = triangleVertices[0][2] * this.weight0;
		var z2 = triangleVertices[1][2] * this.weight1;
		var z3 = triangleVertices[2][2] * this.weight2;

		var result = z1 + z2 + z3;

		return result;
	}

	getTriangleAtPixel() {
		// var foremostTriangle;
		var greatestZ;
		var currentZ;
		var triangleFound = false;
		for (var i = 0; i < this.transformedVertexPositions.length; i++) {
			var objectTriangles = this.transformedVertexPositions[i];
			for (var j = 0; j < objectTriangles.length; j++) {
			    var b1 = this.sign(this.pixelPos, objectTriangles[j][0], objectTriangles[j][1]) < 0.0;
			    var b2 = this.sign(this.pixelPos, objectTriangles[j][1], objectTriangles[j][2]) < 0.0;
			    var b3 = this.sign(this.pixelPos, objectTriangles[j][2], objectTriangles[j][0]) < 0.0;

				if ((b1 === b2) && (b2 === b3)) {
			    	currentZ = this.getInterpolatedDepth(objectTriangles[j]);
					if(!greatestZ || currentZ < greatestZ) {
						greatestZ              = currentZ;
						triangleFound          = true;
						this.targetTriangle[0] = i;
						this.targetTriangle[1] = j;
						// foremostTriangle = this.registeredObjects[i].triangles[j];
						// foremostTriangle = [i, j];
					}
				}
			}
		}

		return triangleFound;
	}

	sign(p1, p2, p3) {
		return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
	}

	setPixel(x, y, r, g, b, a) {
	    var index = (x + y * this.width) * 4;
	    this.imageData.data[index + 0] = r;
	    this.imageData.data[index + 1] = g;
	    this.imageData.data[index + 2] = b;
	    this.imageData.data[index + 3] = a;
	}

	setPerspectiveMatrix(pMatrix) {
		this.pMatrix = pMatrix;
	}
}