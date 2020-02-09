let gls = [];
let canvases = [];
let programInfos = [];
let state = {
	matrix: {},
	mouseOrigin: [0, 0],
	dragging: false,
	currFocus: 0,
	vectors: [],
	gridWidth: 2,
	drawHouse: true
};


function init() {
	state.matrix = new Matrix();
	state.vectors = [new Vector([1, 0, 0], [1.0, 0.81, 0.18, 1.0]), new Vector([0, 1, 0], [0.48, 0.69, 0.91, 1.0])];

	let canvasIds = ["gl-left", "gl-right"];

	for (let i = 0; i < 2; i++) {
		canvases[i] = document.getElementById(canvasIds[i]);
		let canvas = canvases[i];

		gls[i] = initGL(canvas);
		let gl = gls[i];

		let shaderProgram = loadShaders(gl);

		programInfos[i] = {
			program: shaderProgram,
			attribLocations: {
				pos: gl.getAttribLocation(shaderProgram, 'pos'),
				norm: gl.getAttribLocation(shaderProgram, 'norm'),
				tex: gl.getAttribLocation(shaderProgram, 'tex')
			},
			uniformLocations: {
				mvp: gl.getUniformLocation(shaderProgram, 'mvp'),
				color: gl.getUniformLocation(shaderProgram, 'color'),
				texOn: gl.getUniformLocation(shaderProgram, 'texOn')
			},
			screenDimension: canvas.height / canvas.width,
		};

		loadImgTexture(gl, "../assets/huisje_geel.png", (tex) => {
			programInfos[i].house = tex;
		});
	}

	registerMouseEvents(state);
	tick();
}

function tick() {
	requestAnimFrame(tick);
	update();
	draw();
}

function update() {
	updateHTML();
}

function updateHTML() {
	let vectors = [state.vectors[0].vector, state.vectors[1].vector, state.matrix.getTransformedVector(state.vectors[0].vector), state.matrix.getTransformedVector(state.vectors[1].vector)];
	let ids = ["vl-no1", "vl-no2", "vr-no1", "vr-no2"];
	for (let i = 0; i < 4; i++) {
		$("#" + ids[i] + " input").each(function () {
			let index = parseInt(this.className.split(/\s/).filter((cn) => cn.indexOf('v-') === 0)[0].split("-")[1]);
			index--;
			let check = vectors[i][index];
			$(this).val(Math.round(vectors[i][index] * 100) / 100);
		});
	}
}

function draw() {
	let dimMatrix = getDimensionMatrix(programInfos[0], state.gridWidth);
	let matrices = [dimMatrix, mat4.mul(mat4.create(), dimMatrix, state.matrix.getGlMatrix())];

	for (let i = 0; i < 2; i++) {
		let gl = gls[i];
		let programInfo = programInfos[i];

		clearScreen(gl);
		gl.useProgram(programInfo.program);
		gl.uniformMatrix4fv(programInfo.uniformLocations.mvp, false, mat4.create());
		drawAxes(gl, programInfo);
		if(state.drawHouse) {
			gl.uniformMatrix4fv(programInfo.uniformLocations.mvp, false, matrices[i]);
			drawHouse(gl, programInfo);
		}
		state.vectors[0].draw(gl, programInfo, matrices[i]);
		state.vectors[1].draw(gl, programInfo, matrices[i]);
	}

}

init();