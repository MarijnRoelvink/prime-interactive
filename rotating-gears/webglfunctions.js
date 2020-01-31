function clearScreen(gl) {
	// Set clear color to black, fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT);
}

function drawMesh(gl, programInfo, stat, mesh, renderLines = false) {
	gl.useProgram(programInfo.program);
	loadMeshBuffers(gl, programInfo, mesh);
	gl.uniform1i(programInfo.uniformLocations.renderLines, renderLines);
	gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function loadCircle(gl, programInfo, rotation) {
	var radius = 0.7;
	var numPoints = Math.abs(Math.floor(100 * (rotation / (2 * Math.PI))));

	var vertices = [];
	for (var i = 0; i < (numPoints); i++) {
		vertices = vertices.concat([
			Math.cos(i * rotation / numPoints) * radius, Math.sin(i * rotation / numPoints) * radius, 0.0,
			Math.cos((i + 1) * rotation / numPoints) * radius, Math.sin((i + 1) * rotation / numPoints) * radius, 0.0]);
	}

	gl.useProgram(programInfo.circle.program);
	var vertexBuffer = gl.createBuffer();
	//vertexBuffer is now current buffer retrieve data from
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	//insert data into the current vertex buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
	//binds the current vertex buffer to the pos attribute in the shader
	gl.vertexAttribPointer(programInfo.circle.pos, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(programInfo.circle.pos);

}

function drawHouse(gl, programInfo, stat) {
	if (typeof data.house !== 'undefined') {
		let vertices = get2DPlaneFromDim(0.7, 0.7, [0, 0, 0]);
		let texCoor = getTexCoordinatesFromPlane(vertices);
		loadGeometry(gl, programInfo, vertices, [], texCoor);
		gl.uniform1i(programInfo.uniformLocations.renderLines, false);
		gl.uniform1i(programInfo.uniformLocations.texOn, true);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
		gl.uniform1i(programInfo.uniformLocations.texOn, false);
	}
}

function drawCircle(gl, programInfo, stat, thickness) {
	gl.useProgram(programInfo.circle.program);

	loadCircle(gl, programInfo, stat.rotation);
	gl.uniformMatrix3fv(programInfo.circle.scaleToScreen, false, scaleToScreen(programInfo.screenDimension));
	var numItems = Math.abs(Math.floor(100 * stat.rotation / (2 * Math.PI)));
	gl.drawArrays(gl.LINES, 0, 2 * numItems);
}

function setUniforms(gl, programInfo, stat) {
	gl.useProgram(programInfo.program);
	gl.uniformMatrix3fv(programInfo.uniformLocations.scaleToScreen, false, scaleToScreen(programInfo.screenDimension));
	gl.uniformMatrix3fv(programInfo.uniformLocations.rotation, false, rotateMatrix(stat.rotation));
}

/**
 *
 * @param angle
 * @returns {mat3}
 */
function rotateMatrix(angle) {
	return mat3.transpose(mat3.create(), mat3.fromValues(
		Math.cos(angle), -Math.sin(angle), 0,
		Math.sin(angle), Math.cos(angle), 0,
		0, 0, 1));
}

function d2r(angle) {
	return (angle / 360) * 2 * Math.PI;
}

function scaleToScreen(hDivW) {
	if (hDivW < 1) {
		return mat3.transpose(mat3.create(), mat3.fromValues(
			hDivW, 0, 0,
			0, 1, 0,
			0, 0, 1));
	} else {
		return mat3.transpose(mat3.create(), mat3.fromValues(
			1, 0, 0,
			0, 1.0 / hDivW, 0,
			0, 0, 1));
	}

}

