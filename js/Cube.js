class Cube {
	constructor(options) {
		this.mvMatrix  = mat4.create();
		this.tmpMatrix = mat4.create();

		this.rotationAxis = vec3.create();
		this.translation  = vec3.create();

		this.triangles = [
	    	{
	    		vertices: [
					// Front face
					vec3.set(vec3.create(), -1.0, -1.0,  1.0),
					vec3.set(vec3.create(),  1.0, -1.0,  1.0),
					vec3.set(vec3.create(),  1.0,  1.0,  1.0),
				],
				colors: [
					vec3.set(vec3.create(), 0, 0, 0),
					vec3.set(vec3.create(), 255, 255, 255),
					vec3.set(vec3.create(), 255, 255, 255),
				]
			},{
				vertices: [
					vec3.set(vec3.create(), -1.0, -1.0,  1.0),
					vec3.set(vec3.create(), -1.0,  1.0,  1.0),
					vec3.set(vec3.create(),  1.0,  1.0,  1.0)
				],
				colors: [
					vec3.set(vec3.create(), 0, 0, 0),
					vec3.set(vec3.create(), 255, 255, 255),
					vec3.set(vec3.create(), 255, 255, 255),
				]
			},{
				vertices: [
					// Back face
					vec3.set(vec3.create(), -1.0, -1.0, -1.0),
					vec3.set(vec3.create(), -1.0,  1.0, -1.0),
					vec3.set(vec3.create(),  1.0,  1.0, -1.0),
				],
				colors: [
					vec3.set(vec3.create(), 255,   0,   0),
					vec3.set(vec3.create(), 0  , 255,   0),
					vec3.set(vec3.create(), 0  ,   0, 255),
				]
			},{
				vertices: [
					vec3.set(vec3.create(), -1.0, -1.0, -1.0),
					vec3.set(vec3.create(),  1.0,  1.0, -1.0),
					vec3.set(vec3.create(),  1.0, -1.0, -1.0),
				],
				colors: [
					vec3.set(vec3.create(), 255,   0,   0),
					vec3.set(vec3.create(),  0  ,   0, 255),
					vec3.set(vec3.create(),  255, 255, 255),
				]
			},{
				vertices: [
					// Top face
					vec3.set(vec3.create(), -1.0,  1.0, -1.0),
					vec3.set(vec3.create(), -1.0,  1.0,  1.0),
					vec3.set(vec3.create(),  1.0,  1.0,  1.0),
				],
				colors: [
					vec3.set(vec3.create(), 255,   0,   0),
					vec3.set(vec3.create(), 0  , 255,   0),
					vec3.set(vec3.create(), 0  ,   0, 255),
				]
			},{
				vertices: [
					vec3.set(vec3.create(), -1.0,  1.0, -1.0),
					vec3.set(vec3.create(),  1.0,  1.0,  1.0),
					vec3.set(vec3.create(),  1.0,  1.0, -1.0),
				],
				colors: [
					vec3.set(vec3.create(), 255,   0,   0),
					vec3.set(vec3.create(),  0  ,   0, 255),
					vec3.set(vec3.create(),  255, 255, 255),
				]
			},{
				vertices: [
					// Bottom face
					vec3.set(vec3.create(), -1.0, -1.0, -1.0),
					vec3.set(vec3.create(),  1.0, -1.0, -1.0),
					vec3.set(vec3.create(),  1.0, -1.0,  1.0),
				],
				colors: [
					vec3.set(vec3.create(), 255,   0,   0),
					vec3.set(vec3.create(), 0  , 255,   0),
					vec3.set(vec3.create(), 0  ,   0, 255),
				]
			},{
				vertices: [
					vec3.set(vec3.create(), -1.0, -1.0, -1.0),
					vec3.set(vec3.create(),  1.0, -1.0,  1.0),
					vec3.set(vec3.create(), -1.0, -1.0,  1.0),
				],
				colors: [
					vec3.set(vec3.create(), 255,   0,   0),
					vec3.set(vec3.create(),  0  ,   0, 255),
					vec3.set(vec3.create(), 255, 255, 255),
				]
			},{
				vertices: [
					// Right face
					vec3.set(vec3.create(),  1.0, -1.0, -1.0),
					vec3.set(vec3.create(),  1.0,  1.0, -1.0),
					vec3.set(vec3.create(),  1.0,  1.0,  1.0),
				],
				colors: [
					vec3.set(vec3.create(), 255,   0,   0),
					vec3.set(vec3.create(), 0  , 255,   0),
					vec3.set(vec3.create(), 0  ,   0, 255),
				]
			},{
				vertices: [
					vec3.set(vec3.create(),  1.0, -1.0, -1.0),
					vec3.set(vec3.create(),  1.0,  1.0,  1.0),
					vec3.set(vec3.create(),  1.0, -1.0,  1.0),
				],
				colors: [
					vec3.set(vec3.create(), 255,   0,   0),
					vec3.set(vec3.create(),  0  ,   0, 255),
					vec3.set(vec3.create(),  255, 255, 255),
				]
			},{
				vertices: [   
		      		// Left face
					vec3.set(vec3.create(), -1.0, -1.0, -1.0),
					vec3.set(vec3.create(), -1.0, -1.0,  1.0),
					vec3.set(vec3.create(), -1.0,  1.0,  1.0),
				],
				colors: [
					vec3.set(vec3.create(), 255,   0,   0),
					vec3.set(vec3.create(), 0  , 255,   0),
					vec3.set(vec3.create(), 0  ,   0, 255),
				]
			},{
				vertices: [
					vec3.set(vec3.create(), -1.0, -1.0, -1.0),
					vec3.set(vec3.create(), -1.0,  1.0,  1.0),
					vec3.set(vec3.create(), -1.0,  1.0, -1.0),
				],
				colors: [
					vec3.set(vec3.create(), 255,   0,   0),
					vec3.set(vec3.create(), 0  ,   0, 255),
					vec3.set(vec3.create(), 255, 255, 255),
				]
			}
		];
	}

	identity() {
		mat4.identity(this.mvMatrix);
	}

	translate(x, y, z) {
		vec3.set(this.translation, x, y, z);

		mat4.copy(this.tmpMatrix, this.mvMatrix);
		mat4.translate(this.mvMatrix, this.tmpMatrix, this.translation);
	}

	rotate(angle, x, y, z) {
		vec3.set(this.rotationAxis, x, y, z);

		mat4.copy(this.tmpMatrix, this.mvMatrix);
		mat4.rotate(this.mvMatrix, this.tmpMatrix, angle, this.rotationAxis);
	}
};

