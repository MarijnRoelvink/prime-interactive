let gls = [];
let canvases = [];
let programInfos = [];
let state = {
    matrix: {},
    rotation: 0,
    mouseOrigin: [0, 0],
    dragging: false
};


function init(meshes) {
    state.matrix = new Matrix();
    let canvasIds = ["gl-left", "gl-right"];
    let meshIds = ["vector-left", "vector-right"];

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
        programInfos[i].vector = initMesh(gl, programInfos[i], meshes[meshIds[i]]);

    }

    registerMouseEvents(state);
    tick();
}

function tick() {
    requestAnimFrame(tick);
    update();
    draw();
}

function update() {
    state.matrix.update(state.rotation);
}

function draw() {
    let matrices = [mat4.create(), state.matrix.getGlMatrix()];
    let rotationMatrix = mat4.fromRotation(mat4.create(), state.rotation, [0, 0, 1]);

    for (let i = 0; i < 2; i++) {
        let gl = gls[i];
        let programInfo = programInfos[i];

        clearScreen(gl);
        gl.useProgram(programInfo.program);
        gl.uniformMatrix4fv(programInfo.uniformLocations.mvp, false, mat4.create());
        drawAxes(gl, programInfo);
        drawVector(gl, programInfo, mat4.mul(matrices[i], matrices[i], rotationMatrix));

    }

}

OBJ.downloadMeshes({
    'vector-left': '../assets/mesh/vector.obj',
    'vector-right': '../assets/mesh/vector.obj'
}, init);