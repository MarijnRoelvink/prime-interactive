function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object
	gl.shaderSource(shader, source);

	// Compile the shader program
	gl.compileShader(shader);

	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

function loadShaders(gl, name = "", setCustomPos = 0) {

	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, document.getElementById(name + "vertex-shader").text);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, document.getElementById(name + "fragment-shader").text);

	// Create the shader program
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);

	if (setCustomPos) {
		gl.bindAttribLocation(shaderProgram, setCustomPos, 'pos');
	}
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}

function loadTexture(gl, image) {
	const texture = gl.createTexture();

	// Tell WebGL we want to affect texture unit 0
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	return texture;
}

// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadImgTexture(gl, url, callback) {
	const image = new Image();
	image.onload = function () {
		let texture = loadTexture(gl, image);
		callback(texture);
	};
	image.src = url;
}

/**
 * loads geometry into vertexbuffers
 * @param gl: webgl context
 * @param programInfo: {program, attribLocations.pos, attribLocations.norm?, attribLocations.tex?}
 * @param vertices: vertices to load into vertexbuffer
 * @param normals: normals to load into normalbuffer, optional
 * @param texCoordinates: texCoordinates to load into texturebuffer, optional
 */
function loadGeometry(gl, programInfo, vertices, normals = [], texCoordinates = []) {
	gl.useProgram(programInfo.program);
	let vertexBuffer = gl.createBuffer();
	//vertexBuffer is now current buffer retrieve data from
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	//insert data into the current vertex buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	//binds the current vertex buffer to the pos attribute in the shader
	gl.vertexAttribPointer(programInfo.attribLocations.pos, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(programInfo.attribLocations.pos);

	if (typeof programInfo.attribLocations.norm !== 'undefined') {
		if (normals.length === 0) {
			normals = getZeros(vertices.length);
		}
		let normalBuffer = gl.createBuffer();
		//vertexBuffer is now current buffer retrieve data from
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		//insert data into the current normal buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
		//binds the current vertex buffer to the pos attribute in the shader
		gl.vertexAttribPointer(programInfo.attribLocations.norm, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(programInfo.attribLocations.norm);
	}
	if (typeof programInfo.attribLocations.tex !== 'undefined') {
		if (texCoordinates.length === 0) {
			texCoordinates = getZeros(vertices.length / 3 * 2);
		}
		let texBuffer = gl.createBuffer();
		//vertexBuffer is now current buffer retrieve data from
		gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
		//insert data into the current normal buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordinates), gl.STATIC_DRAW);
		//binds the current vertex buffer to the pos attribute in the shader
		gl.vertexAttribPointer(programInfo.attribLocations.tex, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(programInfo.attribLocations.tex);
	}
}

//Loads an image with the given url, when the image is loaded it executes the callback
//with as parameters the image
function loadImage(url, callback) {
	let image = new Image();
	image.onload = function () {
		callback();
	};
	image.src = url;
}

function makeTextCanvas(text, color, width, height) {
	let textCtx = document.createElement("canvas").getContext("2d");
	textCtx.canvas.width = width;
	textCtx.canvas.height = height;
	textCtx.font = "40px monospace";
	textCtx.textAlign = "center";
	textCtx.textBaseline = "middle";
	textCtx.fillStyle = color;
	textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
	textCtx.fillText(text, width / 2, height / 2);
	return textCtx.canvas;
}

function initGL(canvas) {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	var gl = canvas.getContext('webgl');
	// Only continue if WebGL is available and working
	if (gl === null) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}
	return gl;
}

function initMesh(gl, programInfo, mesh) {
	gl.useProgram(programInfo.program);

	//load the mesh into buffers for vertex, normal and texture coordinates and add those to the mesh object
	OBJ.initMeshBuffers(gl, mesh);
	return loadMeshBuffers(gl, programInfo, mesh);

}

function loadMeshBuffers(gl, programInfo, mesh) {
	gl.useProgram(programInfo.program);
	//mesh.vertexBuffer is now current buffer retrieve data from
	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
	//binds the current vertex buffer to the pos attribute in the shader
	gl.vertexAttribPointer(programInfo.attribLocations.pos, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(programInfo.attribLocations.pos);

	// if(programInfo.attribLocations.norm >= 0) {
	//
	// }
	//mesh.normalBuffer is now current buffer retrieve data from
	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
	//binds the current vertex buffer to the norm attribute in the shader
	gl.vertexAttribPointer(programInfo.attribLocations.norm, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(programInfo.attribLocations.norm);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
	return mesh;
}