var gl;
var canvas;
var programInfo;
var data = {};
data.mesh = {};
var stat = {rotation : 0,
        dragging: false,
        mouseOrigin: [0, 0],
        movement: [0, 0]};




function init(meshes) {
    canvas = document.getElementById('glCanvas');
    gl = initGL(canvas);
    var shaderProgram = loadShaders(gl);
    gl.useProgram(shaderProgram);
    programInfo = {
        program: shaderProgram,
        attribLocations: {
            pos: gl.getAttribLocation(shaderProgram, 'pos'),
            norm: gl.getAttribLocation(shaderProgram, 'norm')
        },
        uniformLocations: {
            textoon: gl.getUniformLocation(shaderProgram, 'texToon'),
            rotation: gl.getUniformLocation(shaderProgram, 'rotation')
        },
    };
    registerMouseEvents();
    data.mesh = loadMesh(gl,  programInfo, meshes.gears);
    stat.rotation = 90;
    tick();

}

function registerMouseEvents() {
    canvas.onmousedown = function(event) {
        stat.mouseOrigin = [event.offsetX, event.offsetY];
        stat.dragging = true;
        console.log("Start dragging");

    };

    canvas.onmousemove = function(event) {
        if(stat.dragging) {
            stat.movement = [event.offsetX - stat.mouseOrigin[0],
                event.offsetY - stat.mouseOrigin[1]];
        }
    };

    canvas.onmouseup = function() {
        stat.dragging = false;
        stat.rotation = stat.rotation + stat.movement[0];
        stat.movement = [0, 0];
        console.log("Done dragging");
    };
}

function tick() {
    requestAnimFrame(tick);
    draw();
}

function draw() {
    clearScreen(gl);
    gl.uniformMatrix3fv(programInfo.uniformLocations.rotation, false,  rotateMatrix(stat.rotation + stat.movement[0]));
    gl.drawElements(gl.TRIANGLES, data.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

OBJ.downloadMeshes({
    'gears': 'assets/mesh/Gear.obj'
}, init);