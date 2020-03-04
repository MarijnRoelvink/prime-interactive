class Vector {
	/**
	 * Initializes a vector object: contains methods for drawing and transforming a vector
	 * @param vec: vec3 containing its position
	 * @param color: [r, g, b, w] ranges from 0 to 1
	 * @param thickness: thickness of the arrowline
	 * @param headLength: length of the arrow head
	 * @param headWidth: width of the arrowhead
	 */
	constructor(vec = [0, 0.5, 0], color = [1.0, 1.0, 1.0, 1.0], thickness = 0.01, headLength = 0.1, headWidth = 0.05) {
		this.vector = vec;
		this.thickness = thickness;
		this.color = color;
		this.headLength = 0.1;
		this.headWidth = 0.05;
	}

	getGLMatrix(matrix) {
		let transformedVec = [...this.vector];
		vec3.transformMat4(transformedVec, transformedVec, matrix);
		let scale = vec3.len(transformedVec) - this.headLength + this.thickness / 2;
		let angle = getXAxisAngle(transformedVec);
		let res = mat4.create();
		res[0] = scale;
		let rotMat = mat4.fromRotation(mat4.create(), angle, [0, 0, 1]);
		mat4.mul(res, rotMat, res);
		return res;
	}

	getArrowHeadMatrix(matrix) {
		let transformedVec = [...this.vector];
		vec3.transformMat4(transformedVec, transformedVec, matrix);
		let scale = vec3.len(transformedVec);
		let angle = getXAxisAngle(transformedVec);
		let res = mat4.create();
		mat4.fromRotation(res, angle, [0, 0, 1]);
		mat4.translate(res, res, [scale, 0, 0]);
		return res;
	}

	transform(x, y) {
		this.vector[0] += x;
		this.vector[1] += y;
	}

	draw(gl, programInfo, matrix) {
		gl.uniform4f(programInfo.uniformLocations.color, ...this.color);
		this.drawBase(gl, programInfo, matrix);
		this.drawArrowHead(gl, programInfo, matrix);
	}

	drawBase(gl, programInfo, matrix) {
		gl.uniformMatrix4fv(programInfo.uniformLocations.mvp, false, this.getGLMatrix(matrix));
		let vertices = get2DPlaneFromDim(1, this.thickness, [-this.thickness / 2, -this.thickness / 2, 0]);
		loadGeometry(gl, programInfo, vertices);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
	}

	drawArrowHead(gl, programInfo, matrix) {
		// triangle pointing in the x axis: |>
		let vertices = [-this.headLength, -this.headWidth / 2, 0,
			-this.headLength, this.headWidth / 2, 0,
			0, 0, 0];
		gl.uniformMatrix4fv(programInfo.uniformLocations.mvp, false, this.getArrowHeadMatrix(matrix));
		loadGeometry(gl, programInfo, vertices);
		gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
	}

	toString() {
		return this.vector[0] + ", " + this.vector[1];
	}
}