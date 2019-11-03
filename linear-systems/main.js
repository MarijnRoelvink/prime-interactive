var gl;
var canvas;
var programInfo;
var state = {
    dragging: false,
    mouseOrigin: [0, 0],
    camera: new Camera([12, 12, 0], [0, 0, 0], [0, 0, 1]),
    planes: []
};


function init() {
    canvas = document.getElementById('glCanvas');
    gl = initGL(canvas);
    var shaderProgram = loadShaders(gl, "");
    programInfo = {
        program: shaderProgram,
        attribLocations: {
            pos: gl.getAttribLocation(shaderProgram, 'pos'),
            norm: gl.getAttribLocation(shaderProgram, 'norm')
        },
        uniformLocations: {
            textoon: gl.getUniformLocation(shaderProgram, 'texToon'),
            mvp: gl.getUniformLocation(shaderProgram, 'mvp'),
            color: gl.getUniformLocation(shaderProgram, 'color'),
            scaleToScreen: gl.getUniformLocation(shaderProgram, 'scaleToScreen')
        },
        screenDimension: canvas.height / canvas.width
    };
    getLinearSystem();

    registerMouseEvents();
    registerInputFunctions();
    tick();
}

function registerInputFunctions() {
    window.onresize = function (event) {
        programInfo.screenDimension = canvas.clientHeight / canvas.clientWidth;
    };
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
                state.camera.gumball(0,speed);

                break;
        }
        console.log(state.camera.position);
    };

    $("#matrix td input").each(function() {
        this.onchange = function () {
            console.log("change!");
            getLinearSystem();
        }
    })
}

function getLinearSystem() {
    state.planes = [];
    var params = [];
    $("#input-matrix td input").each(function () {
        params.push($(this).val());
    });
    for(var i = 0; i < 9; i += 3) {
        var plane = params.slice(i, i + 3);
        plane.push($("#ans-vector input")[i/3].value);
        state.planes.push(plane);
    }
}

function registerMouseEvents() {
    var start = function(x, y) {
        state.mouseOrigin = getRotationVector(x,y);
        state.dragging = true;
        console.log("Start dragging");
    };
    var move = function(x, y) {
        if(state.dragging) {
            var movement = getRotationVector(x, y);
            state.camera.gumball(-(movement[0]-state.mouseOrigin[0])*0.01, (movement[1] - state.mouseOrigin[1])*0.01);
            state.mouseOrigin = getRotationVector(x,y);
        }
    };
    var end = function() {
        state.dragging = false;
        console.log("Done dragging");
    };

    canvas.onmousedown = function (event) {
        start(event.offsetX, event.offsetY);
    };
    canvas.ontouchstart = function(event) {
        start(event.touches[0].clientX,event.touches[0].clientY);
    };
    canvas.onmousemove = function(event) {
        move(event.offsetX, event.offsetY);
    };
    canvas.ontouchmove = function(event) {
        move(event.touches[0].clientX,event.touches[0].clientY);
    };
    canvas.onmouseup = end;
    canvas.ontouchend = end;

    window.onresize = function (event) {
        programInfo.screenDimension = canvas.clientHeight/canvas.clientWidth;
    };
}

function getRotationVector(x, y) {
    return [x - window.innerWidth/2,
        y - window.innerHeight/2];
}

function tick() {
    requestAnimFrame(tick);
    update();
    draw();
}

function update() {
    $("#factor").html($("#factor-slider").val());
}

function draw() {
    clearScreen(gl);
    gl.useProgram(programInfo.program);
    setUniforms(gl, programInfo, state);
    drawAxes(gl, programInfo);
    drawPlanes(gl, programInfo, state);
}
init();