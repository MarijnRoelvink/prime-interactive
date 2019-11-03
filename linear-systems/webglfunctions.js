function initGL(canvas) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    var gl = canvas.getContext('webgl');
    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    return gl;
}

function clearScreen(gl) {
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthRange(0, 50);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function loadGeometry(gl, programInfo, vertices) {
    gl.useProgram(programInfo.program);
    var vertexBuffer = gl.createBuffer();
    //vertexBuffer is now current buffer retrieve data from
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //insert data into the current vertex buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    //binds the current vertex buffer to the pos attribute in the shader
    gl.vertexAttribPointer(programInfo.attribLocations.pos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.pos);
}

function drawBox(gl, programInfo, color, dimensions, base) {
    var vertices = getBox(dimensions[0], dimensions[1], dimensions[2], base);
    loadGeometry(gl, programInfo, vertices);
    gl.uniform4f(programInfo.uniformLocations.color, color[0], color[1], color[2], 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
}

function drawAxes(gl, programInfo) {
    var thickness = 0.1;
    var length = 50;

    drawBox(gl, programInfo, [1, 0, 0], [length, thickness, thickness], [length / 2, 0, 0]);
    drawBox(gl, programInfo, [0, 1, 0], [thickness, length, thickness], [0, length / 2, 0]);
    drawBox(gl, programInfo, [0, 0, 1], [thickness, thickness, length], [0, 0, length / 2]);

}

function drawPlanes(gl, programInfo, state) {
    if(!state.planes) {
        return;
    }
    var radius = 5;
    var vertices = getPlane(new Point(radius, radius, getHeight(radius, radius, state.planes[0])),
        new Point(-radius, radius, getHeight(-radius, radius, state.planes[0])),
        new Point(-radius, -radius, getHeight(-radius, -radius, state.planes[0])),
        new Point(radius, -radius, getHeight(radius, -radius, state.planes[0])));
    loadGeometry(gl, programInfo, vertices);
    gl.uniform4f(programInfo.uniformLocations.color, 0.5, 0, 0.5, 0.6);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);

}

//ax + by + cz = d
//ax + by - d = -cz
//(ax + by - d)/-c = z
function getHeight(x, y, params) {
    return (params[0]*x + params[1]*y - params[3])/(-1*params[2]);
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function loadShaders(gl, name, setCustomPos = 0) {

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, document.getElementById(name + "vertex-shader").text);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, document.getElementById(name + "fragment-shader").text);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    if (setCustomPos) {
        gl.bindAttribLocation(shaderProgram, setCustomPos, 'pos');
    }
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function setUniforms(gl, programInfo, state) {
    gl.uniformMatrix3fv(programInfo.uniformLocations.scaleToScreen, false, scaleToScreen(programInfo.screenDimension));

    var proj = mat4.perspective(mat4.create(), 45.0, canvas.width / canvas.height, 0.1, 50.0);
    var mvp = mat4.mul(mat4.create(), proj, state.camera.matrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.mvp, false, mvp);

}



function scaleToScreen(hDivW) {
    return mat3.transpose(mat3.create(),mat3.fromValues(
        hDivW, 0, 0,
        0, 1, 0,
        0, 0, 1));
}

