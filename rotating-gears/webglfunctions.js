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
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function initMesh(gl, programInfo, mesh) {
    gl.useProgram(programInfo.program);

    //load the mesh into buffers for vertex, normal and texture coordinates and add those to the mesh object
    OBJ.initMeshBuffers(gl, mesh);
    return loadMeshBuffers(gl, programInfo, mesh);

}

function loadMeshBuffers(gl, programInfo, mesh) {
    //mesh.vertexBuffer is now current buffer retrieve data from
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
    //binds the current vertex buffer to the pos attribute in the shader
    gl.vertexAttribPointer(programInfo.attribLocations.pos, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.pos);

    //mesh.normalBuffer is now current buffer retrieve data from
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
    //binds the current vertex buffer to the norm attribute in the shader
    gl.vertexAttribPointer(programInfo.attribLocations.norm, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.norm);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    return mesh;
}

function drawMesh(gl, programInfo, stat, mesh, renderLines = false) {
    gl.useProgram(programInfo.program);
    loadMeshBuffers(gl, programInfo, mesh);
    gl.uniformMatrix3fv(programInfo.uniformLocations.scaleToScreen, false, scaleToScreen(programInfo.screenDimension));
    gl.uniformMatrix3fv(programInfo.uniformLocations.rotation, false,  rotateMatrix(stat.rotation));
    gl.uniform1i(programInfo.uniformLocations.renderLines, renderLines);
    gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function loadCircle(gl, programInfo, rotation) {
    var radius = 0.62;
    var numPoints = Math.abs(Math.floor(100*(rotation/(2*Math.PI))));

    var vertices = [];
    for(var i = 0; i < (numPoints); i ++) {
        vertices = vertices.concat([
            Math.cos(i*rotation/numPoints)*radius, Math.sin(i*rotation/numPoints)*radius, 0.0,
            Math.cos((i+1)*rotation/numPoints)*radius, Math.sin((i+1)*rotation/numPoints)*radius, 0.0]);
    }

    gl.useProgram(programInfo.circle.program);
    var vertexBuffer = gl.createBuffer();
    //vertexBuffer is now current buffer retrieve data from
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //insert data into the current vertex buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    //binds the current vertex buffer to the pos attribute in the shader
    gl.vertexAttribPointer(programInfo.circle.pos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.circle.pos);

}

function drawCircle(gl, programInfo, stat, thickness) {
    gl.useProgram(programInfo.circle.program);

    loadCircle(gl, programInfo, stat.rotation);
    gl.uniformMatrix3fv(programInfo.circle.scaleToScreen, false, scaleToScreen(programInfo.screenDimension));
    var numItems = Math.abs(Math.floor(100*stat.rotation/(2*Math.PI)));
    gl.drawArrays(gl.LINES, 0, 2*numItems);
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

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, document.getElementById(name+"vertex-shader").text);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, document.getElementById(name+"fragment-shader").text);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    if(setCustomPos) {
        gl.bindAttribLocation(shaderProgram, setCustomPos, 'pos');
    }
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadPlane(gl, programInfo, pA, pC) {
    var vertexBuffer = gl.createBuffer();

    //vertexBuffer is now current buffer retrieve data from
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const vertices = [
        pC.x, pA.y, 0.0,
        pA.x, pA.y, 0.0,
        pC.x, pC.y, 0.0,
        pA.x, pC.y, 0.0
    ];

    programInfo.pA = pA;
    programInfo.pC = pC;
    //insert data into the current vertex buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //binds the current vertex buffer to the pos attribute in the shader
    gl.vertexAttribPointer(programInfo.attribLocations.pos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.pos);
}

function loadTexture(gl, programInfo, image) {
    const texture = gl.createTexture();

    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    return texture;
}

/**
 *
 * @param angle
 * @returns {mat3}
 */
function rotateMatrix(angle) {
    return mat3.transpose(mat3.createFrom(
        Math.cos(angle), -Math.sin(angle), 0,
        Math.sin(angle), Math.cos(angle), 0,
        0, 0, 1));
}

function d2r (angle) {
    return (angle/360)*2*Math.PI;
}

function scaleToScreen(hDivW) {
    return mat3.transpose(mat3.createFrom(
        hDivW, 0, 0,
        0, 1, 0,
        0, 0, 1));
}

