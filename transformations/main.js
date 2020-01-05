let gls = [];
let canvases = [];
let programInfos = [];
let state = {
    matrix: {}
};


function init(meshes) {
    state.matrix = new Matrix();
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
            },
            uniformLocations: {
                mvp: gl.getUniformLocation(shaderProgram, 'mvp'),
                color: gl.getUniformLocation(shaderProgram, 'color'),
                scaleToScreen: gl.getUniformLocation(shaderProgram, 'scaleToScreen')
            },
            screenDimension: canvas.height / canvas.width,
        };
        //programInfos[i].vector = initMesh(gl, programInfos[i], meshes.vector);

    }

    // registerMouseEvents();
    // registerKeyboardEvents();
    tick();
}

function tick() {
    requestAnimFrame(tick);
    update();
    draw();
}

function update() {
    state.matrix.update();
}

function draw() {
    //TODO: i < 2
    for (let i = 0; i < 2; i++) {
        let gl = gls[i];
        let programInfo = programInfos[i];

        clearScreen(gl);
        gl.useProgram(programInfo.program);
        gl.uniformMatrix4fv(programInfo.uniformLocations.mvp, false, mat4.create());
        drawAxes(gl, programInfo, state);
        //gl.uniform4f(programInfo.uniformLocations.color, 1.0, 1.0, 1.0, 1.0);
       // drawMesh(gl, programInfo, state, programInfo.vector);
    }

}

OBJ.downloadMeshes({
    'vector': '../assets/mesh/vector.obj'
}, init);