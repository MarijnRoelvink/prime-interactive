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
    var shaderProgram = loadShaders(gl, "");
    var circleProgram = loadShaders(gl, "circle-", 6);
    programInfo = {
        program: shaderProgram,
        circle: {
            program: circleProgram,
            pos: gl.getAttribLocation(circleProgram, 'pos')
        },
        attribLocations: {
            pos: gl.getAttribLocation(shaderProgram, 'pos'),
            norm: gl.getAttribLocation(shaderProgram, 'norm')
        },
        uniformLocations: {
            textoon: gl.getUniformLocation(shaderProgram, 'texToon'),
            rotation: gl.getUniformLocation(shaderProgram, 'rotation'),
            scaleToScreen: gl.getUniformLocation(shaderProgram, 'scaleToScreen')
        },
        screenDimension: canvas.height/canvas.width
    };
    registerMouseEvents();
    data.mesh = loadMesh(gl,  programInfo, meshes.gears);
    stat.rotation = 0.5*Math.PI;
    loadCircle(gl, programInfo, stat.rotation);
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
            stat.movement = [d2r((event.offsetX - stat.mouseOrigin[0])/2),
                d2r((event.offsetY - stat.mouseOrigin[1])/2)];
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
    update();
    draw();
}
function update() {
    updateMatrix();
}
function updateMatrix() {
    var angle = (stat.rotation + stat.movement[0] - 0.5*Math.PI)%(2*Math.PI);
    angle = Math.round(angle/Math.PI*100)/100;
    document.querySelectorAll(".angle").forEach(function(el) {
        el.innerHTML = angle + "&pi;"
    });
}

function draw() {
    clearScreen(gl);

    gl.useProgram(programInfo.program);
    gl.uniformMatrix3fv(programInfo.uniformLocations.scaleToScreen, false, scaleToScreen(programInfo.screenDimension));
    gl.uniformMatrix3fv(programInfo.uniformLocations.rotation, false,  rotateMatrix(stat.rotation + stat.movement[0]));
    gl.drawElements(gl.TRIANGLES, data.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    gl.useProgram(programInfo.circle.program);
    gl.drawArrays(gl.LINES, 0, 100*(0.5*Math.PI%(2*Math.PI)/(2*Math.PI)));
}

OBJ.downloadMeshes({
    'gears': 'assets/mesh/Gear.obj'
}, init);