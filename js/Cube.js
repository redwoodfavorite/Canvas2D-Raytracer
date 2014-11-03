class Cube {
	constructor(options) {
		this.mvMatrix  = mat4.create();
		this.tmpMatrix = mat4.create();

		this.rotationAxis = vec3.create();
		this.translation  = vec3.create();

		this.triangles = [
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

