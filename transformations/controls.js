//returns array with two vec3's
function getTranformedVectors() {
	return [state.matrix.getTransformedVector(state.vectors[0].vector),
		state.matrix.getTransformedVector(state.vectors[1].vector)];
}


function calcNewMatrix(vecsA, vecsB) {
	let mA = mat2.fromValues(vecsA[0][0], vecsA[0][1], vecsA[1][0], vecsA[1][1]);
	let mB = mat2.fromValues(vecsB[0][0], vecsB[0][1], vecsB[1][0], vecsB[1][1]);
	return solve2DMatrixEquation(mA, mB);
}


function registerMouseEvents(state) {
	let getRelativeVector = function (x, y, el) {
		return [x / el.offsetWidth * (2*state.gridWidth), y / el.offsetWidth * (2*state.gridWidth)];
	};

	//start movement/dragging (a click or a touch)
	let start = function (x, y, el) {
		state.mouseOrigin = [x, y];
		state.dragging = true;
		let pos = getRelativeVector(x, y, el);

		//find which canvas you are at, and then which arrow you are closest to
		pos = [pos[0] - state.gridWidth, state.gridWidth*programInfos[0].screenDimension - pos[1]];
		if(el.id === "gl-left") {
			state.currCanvasLeft =true;
			state.currFocus = getVecDistance(pos, state.vectors[0].vector) < getVecDistance(pos, state.vectors[1].vector) ? 0 : 1;
		} else if(el.id === "gl-right") {
			state.currCanvasLeft = false;
			let tvs = getTranformedVectors();
			state.currFocus = getVecDistance(pos, tvs[0]) < getVecDistance(pos, tvs[1]) ? 0 : 1;
		}
	};

	let move = function (x, y, el) {
		if (state.dragging) {
			let movement = getRelativeVector(x - state.mouseOrigin[0], -(y - state.mouseOrigin[1]), el);
			let vec = state.vectors[state.currFocus];

			//transform the vectors, only when mouse position is in current canvas.
			if (el.id === "gl-left" && state.currCanvasLeft) {
				vec.transform(movement[0], movement[1]);
			} else if (el.id === "gl-right" && !state.currCanvasLeft) {
				let tvs = getTranformedVectors();
				tvs[state.currFocus][0] += movement[0];
				tvs[state.currFocus][1] += movement[1];
				state.matrix.setMat2(calcNewMatrix(state.vectors.map((v) => v.vector), tvs));
			}
			state.mouseOrigin = [x, y];
		}
	};
	let end = function () {
		state.dragging = false;
	};

	for (let i = 0; i < 2; i++) {
		let canvas = canvases[i];

		canvas.onmousedown = function (event) {
			start(event.offsetX, event.offsetY, event.target);
		};
		canvas.ontouchstart = function (event) {
			start(event.touches[0].clientX, event.touches[0].clientY, event.targetTouches[0]);
		};
		canvas.onmousemove = function (event) {
			move(event.offsetX, event.offsetY, event.target);
		};
		canvas.ontouchmove = function (event) {
			move(event.touches[0].clientX, event.touches[0].clientY, event.targetTouches[0]);
		};
		canvas.onmouseup = end;
		canvas.ontouchend = end;
	}

	window.onresize = function (event) {
		for (let i = 0; i < 2; i++) {
			let programInfo = programInfos[i];
			let canvas = canvases[i];
			programInfo.screenDimension = canvas.clientHeight / canvas.clientWidth;
		}
	};

	$("#toggle-house img").click(() => {
		state.drawHouse = !state.drawHouse;
		$("#house-on").css("display", state.drawHouse? "inline" : "none");
		$("#house-off").css("display", !state.drawHouse? "inline" : "none");
	});
}

function registerNumberInput(state) {
	for (let i = 0; i < 2; i++) {
		$("#vl-no" + (i+1) + " input").each(function() {
			this.onchange = () => {
				let index = parseInt($(this).attr("cell")) - 1;
				state.vectors[i].vector[index] = parseFloat(this.value);
			};
		});
	}
	for (let i = 0; i < 2; i++) {
		$("#vr-no" + (i+1) + " input").each(function() {
			this.onchange = () => {
				let index = parseInt($(this).attr("cell")) - 1;
				let tvs = getTranformedVectors();
				tvs[i][index] = parseFloat(this.value);
				state.matrix.setMat2(calcNewMatrix(state.vectors.map((v) => v.vector), tvs));
			};
		});
	}

	$("#transformation-matrix td input").each(function() {
		let index = this.id.split("-");
		let rowIndex = index[1] - 1;
		let colIndex = index[2] - 1;

		this.onchange = function () {
			state.matrix.matrix[rowIndex][colIndex] = parseFloat(this.value);
		}
	});
}


