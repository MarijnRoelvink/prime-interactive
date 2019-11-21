var gl;
var canvas;
var programInfo;
var data = {};
data.mesh = {};
data.vector = {};
var stat = {
    rotation: 0,
    dragging: false,
    mouseOrigin: [0, 0],
};



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
            renderLines: gl.getUniformLocation(shaderProgram, 'renderLines'),
            scaleToScreen: gl.getUniformLocation(shaderProgram, 'scaleToScreen')
        },
        screenDimension: canvas.height/canvas.width
    };
    data.mesh = initMesh(gl,  programInfo, meshes.gears);
    data.vector = initMesh(gl, programInfo, meshes.vector);
    stat.rotation = 0;

    registerMouseEvents();
    tick();

}

function registerMouseEvents() {
    var start = function(x, y) {
        stat.mouseOrigin = getRotationVector(x,y);
        stat.dragging = true;
        console.log("Start dragging");
    };
    canvas.onmousedown = function (event) {
        start(event.offsetX, event.offsetY);
    };
    canvas.ontouchstart = function(event) {
        start(event.touches[0].clientX,event.touches[0].clientY);
    };

    var move = function(x, y) {
        if(stat.dragging) {
            stat.rotation += getVectorAngle(getRotationVector(x,y), stat.mouseOrigin);
            stat.mouseOrigin = getRotationVector(x,y);
        }
    };
    canvas.onmousemove = function(event) {
        move(event.offsetX, event.offsetY);
    };
    canvas.ontouchmove = function(event) {
        move(event.touches[0].clientX,event.touches[0].clientY);
    };

    var end = function() {
        stat.dragging = false;
        console.log("Done dragging");
    };
    canvas.onmouseup = end;
    canvas.ontouchend = end;

    window.onresize = function (event) {
        programInfo.screenDimension = canvas.clientHeight/canvas.clientWidth;
    }
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
    updateMatrix();
}
function updateMatrix() {
    var angle = stat.rotation;
    angle = Math.round(angle/Math.PI*100)/100;
    document.querySelectorAll(".angle").forEach(function(el) {
        el.innerHTML = angle.toFixed(2) + "&pi;"
    });
}

function draw() {
    clearScreen(gl);

    drawMesh(gl, programInfo, stat, data.mesh);
    drawMesh(gl, programInfo, stat, data.vector, true);
    drawCircle(gl, programInfo, stat);


}

OBJ.downloadMeshes({
    'gears': '../assets/mesh/Gear.obj',
    'vector': '../assets/mesh/vector.obj'
}, init);