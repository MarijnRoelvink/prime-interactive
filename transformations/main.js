let gls = [];
let canvases = [];
let programInfos = [];
let state = {
    matrix: {},
    mouseOrigin: [0, 0],
    dragging: false,
    vector: {}
};


function init(meshes) {
    state.matrix = new Matrix();
    state.vector = new Vector();

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
    updateHTML();
}

function updateHTML() {
    let vectors = [state.vector.vector, state.matrix.getTransformedVector(state.vector.vector)];
    let ids = ["vl", "vr"];
    for (let i = 0; i < 2; i++) {
        $("#" + ids[i] + " input").each(function () {
            let index = this.id.split("-");
            let rowIndex = index[1] - 1;
            $(this).val(Math.round(vectors[i][rowIndex]*100)/100);
        });
    }
}

function draw() {
    let matrices = [mat4.create(), state.matrix.getGlMatrix()];

    for (let i = 0; i < 2; i++) {
        let gl = gls[i];
        let programInfo = programInfos[i];

        clearScreen(gl);
        gl.useProgram(programInfo.program);
        gl.uniformMatrix4fv(programInfo.uniformLocations.mvp, false, mat4.create());
        drawAxes(gl, programInfo);
        state.vector.draw(gl, state, programInfo, matrices[i], programInfo.vector);

    }

}

OBJ.downloadMeshes({
    'vector-left': '../assets/mesh/vector_head.obj',
    'vector-right': '../assets/mesh/vector_head.obj'
}, init);