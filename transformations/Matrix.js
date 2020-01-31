class Matrix {
	constructor() {
		this.matrix = [[1, 0],
			[0, 1]];
		this.locked = true;
		this.registerHTMLChanges();
		this.updateHTMLSystem();
	}

	registerHTMLChanges() {
		let self = this;
		$("#transformation-matrix td input").each(function () {
			let index = this.id.split("-");
			let rowIndex = index[1] - 1;
			let colIndex = index[2] - 1;

			this.onchange = function () {
				console.log(this.value);
				self.matrix[rowIndex][colIndex] = parseFloat(this.value);
			}
		})
	}

	updateHTMLSystem() {
		for (let i = 0; i < 2; i++) {
			for (let j = 0; j < 2; j++) {
				let selector = "#m-" + (i + 1) + "-" + (j + 1);
				$(selector).val(Math.round(this.matrix[i][j] * 100) / 100);
			}
		}
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
		this.updateHTMLSystem();
	}

	getTransformedVector(vector) {
		return vec3.transformMat4(vec3.create(), vector, this.getGlMatrix());
	}


}