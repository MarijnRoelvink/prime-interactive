function registerMouseEvents(state) {
    let getRotationVector = function (x, y, el) {
        return [x - el.offsetWidth / 2,
            y - el.offsetHeight / 2];
    };

    let start = function (x, y, el) {
        state.mouseOrigin = getRotationVector(x, y, el);
        state.dragging = true;
    };
    let move = function (x, y, el) {
        if (state.dragging) {
            state.rotation += getVectorAngle(getRotationVector(x, y, el), state.mouseOrigin);
            state.mouseOrigin = getRotationVector(x, y, el);
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

