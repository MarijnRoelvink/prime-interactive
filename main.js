var gl;
var canvas;
var programInfo;
var data = {};
data.mesh = {};
data.vector = {};
var stat = {rotation : 0,
        oldRotation : 0,
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
            pos: gl.getAttribLocation(circleProgram, 'pos'),
            scaleToScreen: gl.getUniformLocation(circleProgram, 'scaleToScreen')

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
    data.mesh = initMesh(gl,  programInfo, meshes.gears);
    data.vector = initMesh(gl, programInfo, meshes.vector);

    stat.rotation = 0;
    tick();

}

function registerMouseEvents() {
    canvas.onmousedown = function(event) {
        stat.mouseOrigin = [event.offsetX, event.offsetY];
        stat.dragging = true;
        stat.oldRotation = stat.rotation;
        console.log("Start dragging");

    };

    canvas.onmousemove = function(event) {
        if(stat.dragging) {
            stat.movement = [d2r((event.offsetX - stat.mouseOrigin[0])/2),
                d2r((event.offsetY - stat.mouseOrigin[1])/2)];
            stat.rotation = (stat.oldRotation + stat.movement[0])%(2*Math.PI);
        }
    };

    canvas.onmouseup = function() {
        stat.dragging = false;
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
    var angle = stat.rotation;
    angle = Math.round(angle/Math.PI*100)/100;
    document.querySelectorAll(".angle").forEach(function(el) {
        el.innerHTML = angle + "&pi;"
    });
}

function draw() {
    clearScreen(gl);

    drawMesh(gl, programInfo, stat, data.mesh);
    drawMesh(gl, programInfo, stat, data.vector);
    drawCircle(gl, programInfo, stat);


}

OBJ.downloadMeshes({
    'gears': 'assets/mesh/Gear.obj',
    'vector': 'assets/mesh/vector.obj'
}, init);