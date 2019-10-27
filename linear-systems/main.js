var gl;
var canvas;
var programInfo;
var data = {};
data.mesh = {};
data.vector = {};
var state = {
    dragging: false,
    mouseOrigin: [0, 0],
    camera: new Camera([12, 12, 5], [0, 0, 0], [0, 0, 1]),
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
    tick();
}

function registerMouseEvents() {
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
    }
}

function getLinearSystem() {
    var params = [];
    $("#input-matrix td input").each(function (node) {
        params.push($(this).val());
    });
    var plane1 = params.slice(0, 3);
    plane1.push($("#ans-vector input").val());
    state.planes.push(plane1);
}

function getRotationVector(event) {
    return [event.offsetX - window.innerWidth / 2,
        event.offsetY - window.innerHeight / 2];
}

function tick() {
    requestAnimFrame(tick);
    draw();
}

function draw() {
    clearScreen(gl);
    gl.useProgram(programInfo.program);
    setUniforms(gl, programInfo, state);
    drawAxes(gl, programInfo);
    drawPlanes(gl, programInfo, state);
}
init();