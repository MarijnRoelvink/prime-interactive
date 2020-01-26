var gl;
var canvas;
var programInfo;
var state = {
    dragging: false,
    mouseOrigin: [0, 0],
    camera: new Camera([12, 12, 4], [0, 0, 0], [0, 0, 1]),
    linearSystem: new LinearSystem(),
    boundingBox: 5
};


function init() {
    canvas = document.getElementById('glCanvas');
    gl = initGL(canvas);
    var shaderProgram = loadShaders(gl, "");
    programInfo = {
        program: shaderProgram,
        attribLocations: {
            pos: gl.getAttribLocation(shaderProgram, 'pos'),
            norm: gl.getAttribLocation(shaderProgram, 'norm'),
            tex: gl.getAttribLocation(shaderProgram, "tex")
        },
        uniformLocations: {
            texture: gl.getUniformLocation(shaderProgram, 'texture'),
            textureOn: gl.getUniformLocation(shaderProgram, 'textureOn'),
            mvp: gl.getUniformLocation(shaderProgram, 'mvp'),
            color: gl.getUniformLocation(shaderProgram, 'color'),
            lightPos: gl.getUniformLocation(shaderProgram, 'lightPos'),
            ka: gl.getUniformLocation(shaderProgram, 'ka'),
            kd: gl.getUniformLocation(shaderProgram, 'kd'),
            scaleToScreen: gl.getUniformLocation(shaderProgram, 'scaleToScreen')
        },
        loadedTextures: {}
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
    cleanConsole();
    state.linearSystem.update();
    updateSliders();
    state.camera.setZoom(100 / parseFloat($("#zoom-slider").val()));
}

function draw() {
    clearScreen(gl);
    gl.useProgram(programInfo.program);
    setUniforms(gl, programInfo, state);
    drawAxes(gl, programInfo, state);
    drawPlanes(gl, programInfo, state);
    drawBoundingBox(gl, programInfo, state);
}

// $(document).ready(() => {
//     setTimeout(init, 500);
// });
init();