function registerMouseEvents(state) {
    let getRelativeVector = function(x, y, el) {
        return [x/el.offsetWidth*2, y/el.offsetHeight*2];
    };

    let start = function (x, y, el) {
        state.mouseOrigin = [x, y];
        state.dragging = true;
    };
    let move = function (x, y, el) {
        if (state.dragging) {
            let movement = getRelativeVector(x - state.mouseOrigin[0], -(y - state.mouseOrigin[1]), el);
            state.vector.transform(movement[0], movement[1]);
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

