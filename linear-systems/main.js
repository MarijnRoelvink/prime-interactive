var gl;
var canvas;
var programInfo;
var state = {
    dragging: false,
    mouseOrigin: [0, 0],
    camera: new Camera([12, 12, 0], [0, 0, 0], [0, 0, 1]),
    linearSystem: new LinearSystem()
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
            lightPos: gl.getUniformLocation(shaderProgram, 'lightPos'),
            ka: gl.getUniformLocation(shaderProgram, 'ka'),
            kd: gl.getUniformLocation(shaderProgram, 'kd'),
            scaleToScreen: gl.getUniformLocation(shaderProgram, 'scaleToScreen')
        },
        screenDimension: canvas.height / canvas.width
    };
    registerMouseEvents();
    registerKeyboardEvents();
    tick();
}

function tick() {
    requestAnimFrame(tick);
    update();
    draw();
}

function update() {
    state.linearSystem.update();
    updateSliders();
    state.camera.setZoom(100/parseFloat($("#zoom-slider").val()));
}

function draw() {
    clearScreen(gl);
    gl.useProgram(programInfo.program);
    setUniforms(gl, programInfo, state);
    drawAxes(gl, programInfo);
    drawPlanes(gl, programInfo, state);
}

init();