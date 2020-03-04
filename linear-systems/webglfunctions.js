function clearScreen(gl) {
	// Set clear color to black, fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.depthRange(0, 200);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function drawBox(gl, programInfo, color, dimensions, base) {
	let vertices = getBox(dimensions[0], dimensions[1], dimensions[2], base);
	loadGeometry(gl, programInfo, vertices, getNormalsFromBox(vertices));
	gl.uniform4f(programInfo.uniformLocations.color, color[0], color[1], color[2], 1);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
}

function drawText(gl, programInfo, text, color, points) {
	let vertices = getPlane(...points);
	loadGeometry(gl, programInfo, vertices, [], getTexCoordinatesFromPlane());

	if (!programInfo.loadedTextures[text]) {
		programInfo.loadedTextures[text] = loadTexture(gl, makeTextCanvas(text, color, 32 * text.length, 32));
	}
	let texture = programInfo.loadedTextures[text];
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.uniform1f(programInfo.uniformLocations.kd, 0);
	gl.uniform1f(programInfo.uniformLocations.ka, 0.8);
	gl.uniform1i(programInfo.uniformLocations.texture, 0);

	gl.uniform1i(programInfo.uniformLocations.textureOn, true);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
	gl.uniform1i(programInfo.uniformLocations.textureOn, false);
}

function drawLine(gl, programInfo, state, color, pointA, pointB) {
	loadGeometry(gl, programInfo, pointA.concat(pointB))
	gl.uniform4f(programInfo.uniformLocations.color, ...color, 1);
	gl.drawArrays(gl.LINES, 0, 2);

}

function drawAxes(gl, programInfo, state) {
	let thickness = 0.1;
	let length = 50;

	gl.uniform1f(programInfo.uniformLocations.kd, 0);
	gl.uniform1f(programInfo.uniformLocations.ka, 0.8);

	drawBox(gl, programInfo, [1, 0, 0], [length, thickness, thickness], [length / 2, 0, 0]);
	drawBox(gl, programInfo, [0, 1, 0], [thickness, length, thickness], [0, length / 2, 0]);
	drawBox(gl, programInfo, [0, 0, 1], [thickness, thickness, length], [0, 0, length / 2]);
}

function drawPlanes(gl, programInfo, state) {
	let radius = state.boundingBox * state.camera.zoom;

	gl.uniform1f(programInfo.uniformLocations.kd, 0.6);
	gl.uniform1f(programInfo.uniformLocations.ka, 0.2);

	for (let i = 0; i < 3; i++) {
		let vertices;
		let planes = state.linearSystem.planes;
		let x = planes[i][0] !== 0;
		let y = planes[i][1] !== 0;
		let z = planes[i][2] !== 0;
		if (z) {
			vertices = getPlane(new Point(radius, radius, getZ(radius, radius, planes[i])),
				new Point(-radius, radius, getZ(-radius, radius, planes[i])),
				new Point(-radius, -radius, getZ(-radius, -radius, planes[i])),
				new Point(radius, -radius, getZ(radius, -radius, planes[i])));
		} else if (y) {
			vertices = getPlane(new Point(radius, getY(radius, radius, planes[i]), radius),
				new Point(-radius, getY(-radius, radius, planes[i]), radius),
				new Point(-radius, getY(-radius, -radius, planes[i]), -radius),
				new Point(radius, getY(radius, -radius, planes[i]), -radius));
		} else if (x) {
			vertices = getPlane(new Point(getX(radius, radius, planes[i]), radius, radius),
				new Point(getX(-radius, radius, planes[i]), -radius, radius),
				new Point(getX(-radius, -radius, planes[i]), -radius, -radius),
				new Point(getX(radius, -radius, planes[i]), radius, -radius));
		}
		if (vertices) {
			loadGeometry(gl, programInfo, vertices, getNormalsFromPlane(vertices));
			gl.uniform4f(programInfo.uniformLocations.color, colors[i][0], colors[i][1], colors[i][2], 0.8);
			// gl.uniform4f(programInfo.uniformLocations.color, (i/2.0), 0, 1.0-i*0.5, 0.6);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
		}
	}
}

function drawBoundingBox(gl, programInfo, state) {
	let boundingBox = state.boundingBox * state.camera.zoom;
	let bbText = boundingBox.toFixed().toString();
	drawText(gl, programInfo, bbText, "white",
		[new Point(boundingBox, 0, 0),
			new Point(boundingBox + 0.5 * state.camera.zoom * bbText.length, 0, 0),
			new Point(boundingBox + 0.5 * state.camera.zoom * bbText.length, 0, 0.5 * state.camera.zoom),
			new Point(boundingBox, 0, 0.5 * state.camera.zoom)]);
	drawText(gl, programInfo, bbText, "white",
		[new Point(0, 0.5 * state.camera.zoom * bbText.length, boundingBox),
			new Point(0, 0, boundingBox),
			new Point(0, 0, boundingBox + 0.5 * state.camera.zoom),
			new Point(0, 0.5 * state.camera.zoom * bbText.length, boundingBox + 0.5 * state.camera.zoom)]);
	drawText(gl, programInfo, bbText, "white",
		[new Point(0, boundingBox + 0.5 * state.camera.zoom * bbText.length, 0),
			new Point(0, boundingBox, 0),
			new Point(0, boundingBox, 0.5 * state.camera.zoom),
			new Point(0, boundingBox + 0.5 * state.camera.zoom * bbText.length, 0.5 * state.camera.zoom)]);

	gl.uniform1f(programInfo.uniformLocations.kd, 0);
	gl.uniform1f(programInfo.uniformLocations.ka, 0.9);
	drawBox(gl, programInfo, [1, 1, 1], [0.05 / state.camera.zoom, 0.12, 0.12], [boundingBox, 0, 0]);
	drawBox(gl, programInfo, [1, 1, 1], [0.12, 0.05, 0.12], [0, boundingBox, 0]);
	drawBox(gl, programInfo, [1, 1, 1], [0.12, 0.12, 0.05], [0, 0, boundingBox]);

}

function setUniforms(gl, programInfo, state) {
	let proj = mat4.perspective(mat4.create(), 45.0, canvas.clientWidth / canvas.clientHeight, 0.1, 100.0);
	let mvp = mat4.mul(mat4.create(), proj, state.camera.matrix);
	gl.uniformMatrix4fv(programInfo.uniformLocations.mvp, false, mvp);

	gl.uniform3f(programInfo.uniformLocations.lightPos, state.camera.getPosition()[0], state.camera.getPosition()[1], state.camera.getPosition()[2]);
}

