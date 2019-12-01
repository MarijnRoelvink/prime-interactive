function registerMouseEvents() {
    let getRotationVector = function (x, y) {
        return [x - window.innerWidth / 2,
            y - window.innerHeight / 2];
    };

    let start = function (x, y) {
        state.mouseOrigin = getRotationVector(x, y);
        state.dragging = true;
    };
    let move = function (x, y) {
        if (state.dragging) {
            var movement = getRotationVector(x, y);
            state.camera.gumball(-(movement[0] - state.mouseOrigin[0]) * 0.01, (movement[1] - state.mouseOrigin[1]) * 0.01);
            state.mouseOrigin = getRotationVector(x, y);
        }
    };
    let end = function () {
        state.dragging = false;
    };

    canvas.onmousedown = function (event) {
        start(event.offsetX, event.offsetY);
    };
    canvas.ontouchstart = function (event) {
        start(event.touches[0].clientX, event.touches[0].clientY);
    };
    canvas.onmousemove = function (event) {
        move(event.offsetX, event.offsetY);
    };
    canvas.ontouchmove = function (event) {
        move(event.touches[0].clientX, event.touches[0].clientY);
    };
    canvas.onmouseup = end;
    canvas.ontouchend = end;

    window.onresize = function (event) {
        programInfo.screenDimension = canvas.clientHeight / canvas.clientWidth;
    };
}

function registerKeyboardEvents() {
    window.onkeypress = function (event) {
        console.log(event.key);
        var speed = 0.05;
        switch (event.key) {
            case "a" :
                state.camera.gumball(-speed, 0);
                break;
            case "s" :
                state.camera.gumball(0, -speed);
                break;
            case "d" :
                state.camera.gumball(speed, 0);
                break;
            case "w" :
                state.camera.gumball(0, speed);

                break;
        }
    };
}

function updateSliders() {
    $(".slider").each(function () {
        let id = this.id.replace("-slider", "");
        $("#" + id + "-factor").html(this.value);
    });
}