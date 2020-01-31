function registerMouseEvents(state) {
	let getRelativeVector = function (x, y, el) {
		return [x / el.offsetWidth * 2, y / el.offsetHeight * 2];
	};

	let start = function (x, y, el) {
		state.mouseOrigin = [x, y];
		state.dragging = true;
		let pos = getRelativeVector(x, y, el);
		pos = [pos[0] - 1, 1 - pos[1]];
		state.currFocus = getVecDistance(pos, state.vectors[0].vector) < getVecDistance(pos, state.vectors[1].vector) ? 0 : 1;
		;
	};
	let move = function (x, y, el) {
		if (state.dragging) {
			let movement = getRelativeVector(x - state.mouseOrigin[0], -(y - state.mouseOrigin[1]), el);
			let vec = state.vectors[state.currFocus];
			if (el.id === "gl-left") {
				vec.transform(movement[0], movement[1]);
			} else if (el.id === "gl-right") {
				let tvs = [vec3.transformMat4(vec3.create(), state.vectors[0].vector, state.matrix.getGlMatrix()),
					vec3.transformMat4(vec3.create(), state.vectors[1].vector, state.matrix.getGlMatrix())];
				tvs[state.currFocus][0] += movement[0];
				tvs[state.currFocus][1] += movement[1];
				let mA = mat2.fromValues(state.vectors[0].vector[0], state.vectors[0].vector[1], state.vectors[1].vector[0], state.vectors[1].vector[1]);
				let mB = mat2.fromValues(tvs[0][0], tvs[0][1], tvs[1][0], tvs[1][1]);
				state.matrix.setMat2(solve2DMatrixEquation(mA, mB));
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
}

