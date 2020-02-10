class Matrix {
	constructor() {
		this.matrix = [[1, 0],
			[0, 1]];
	}

	getGlMatrix() {
		//glMatrix wants to receive values row-first instead of column first.
		// For the sake of easy reading i feed them column first before transposing
		return mat4.transpose(mat4.create(), mat4.fromValues(
			this.matrix[0][0], this.matrix[0][1], 0, 0,
			this.matrix[1][0], this.matrix[1][1], 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1));
	}

	from4Dto2DMatrix(matrix) {
		this.matrix = [[matrix[0], matrix[4]],
			[matrix[1], matrix[5]]];
	}

	setMat2(matrix) {
		this.matrix = [[matrix[0], matrix[2]], [matrix[1], matrix[3]]];
	}

	getTransformedVector(vector) {
		return vec3.transformMat4(vec3.create(), vector, this.getGlMatrix());
	}


}