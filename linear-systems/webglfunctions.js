function initGL(canvas) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    let gl = canvas.getContext('webgl');
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

function loadGeometry(gl, programInfo, vertices, normals = []) {
    gl.useProgram(programInfo.program);
    let vertexBuffer = gl.createBuffer();
    //vertexBuffer is now current buffer retrieve data from
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //insert data into the current vertex buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    //binds the current vertex buffer to the pos attribute in the shader
    gl.vertexAttribPointer(programInfo.attribLocations.pos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.pos);

    if(normals) {
        let normalBuffer = gl.createBuffer();
        //vertexBuffer is now current buffer retrieve data from
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        //insert data into the current normal buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        //binds the current vertex buffer to the pos attribute in the shader
        gl.vertexAttribPointer(programInfo.attribLocations.norm, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.norm);
    }
}

function drawBox(gl, programInfo, color, dimensions, base) {
    let vertices = getBox(dimensions[0], dimensions[1], dimensions[2], base);
    loadGeometry(gl, programInfo, vertices);
    gl.uniform4f(programInfo.uniformLocations.color, color[0], color[1], color[2], 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
}

function drawAxes(gl, programInfo) {
    let thickness = 0.1;
    let length = 50;

    gl.uniform1f(programInfo.uniformLocations.kd, 0);
    gl.uniform1f(programInfo.uniformLocations.ka, 0.8);

    drawBox(gl, programInfo, [1, 0, 0], [length, thickness, thickness], [length / 2, 0, 0]);
    drawBox(gl, programInfo, [0, 1, 0], [thickness, length, thickness], [0, length / 2, 0]);
    drawBox(gl, programInfo, [0, 0, 1], [thickness, thickness, length], [0, 0, length / 2]);

}

function drawPlanes(gl, programInfo, state) {
    let radius = 5*state.camera.zoom;

    gl.uniform1f(programInfo.uniformLocations.kd, 0.6);
    gl.uniform1f(programInfo.uniformLocations.ka, 0.2);

    for(let i = 0; i < 3; i ++) {
        let vertices;
        let planes = state.linearSystem.planes;
        let x = planes[i][0] !== 0;
        let y = planes[i][1] !== 0;
        let z = planes[i][2] !== 0;
        if(z) {
            vertices = getPlane(new Point(radius, radius, getZ(radius, radius, planes[i])),
                new Point(-radius, radius, getZ(-radius, radius, planes[i])),
                new Point(-radius, -radius, getZ(-radius, -radius, planes[i])),
                new Point(radius, -radius, getZ(radius, -radius, planes[i])));
        } else if(y) {
            vertices = getPlane(new Point(radius, getY(radius, radius, planes[i]), radius),
                new Point(-radius, getY(-radius, radius, planes[i]), radius),
                new Point(-radius, getY(-radius, -radius, planes[i]), -radius),
                new Point(radius, getY(radius, -radius, planes[i]), -radius));
        } else if (x) {
            vertices = getPlane(new Point(getX(radius, radius, planes[i]), radius, radius),
                new Point(getX(-radius, radius, planes[i]), -radius,  radius),
                new Point(getX(-radius, -radius, planes[i]), -radius, -radius),
                new Point(getX(radius, -radius, planes[i]), radius, -radius));
        }
        if(vertices) {
            loadGeometry(gl, programInfo, vertices, getNormalsFromPlane(vertices));
            gl.uniform4f(programInfo.uniformLocations.color, colors[i][0],colors[i][1],colors[i][2], 0.8);
            // gl.uniform4f(programInfo.uniformLocations.color, (i/2.0), 0, 1.0-i*0.5, 0.6);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
        }
    }

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

    let proj = mat4.perspective(mat4.create(), 45.0, canvas.width / canvas.height, 0.1, 100.0);
    let mvp = mat4.mul(mat4.create(), proj, state.camera.matrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.mvp, false, mvp);

    gl.uniform3f(programInfo.uniformLocations.lightPos, state.camera.position[0], state.camera.position[1], state.camera.position[2]);

}



function scaleToScreen(hDivW) {
    return mat3.transpose(mat3.create(),mat3.fromValues(
        hDivW, 0, 0,
        0, 1, 0,
        0, 0, 1));
}

