function clearScreen(gl) {
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function loadGeometry(gl, programInfo, vertices, normals = [], texCoordinates = []) {
    gl.useProgram(programInfo.program);
    let vertexBuffer = gl.createBuffer();
    //vertexBuffer is now current buffer retrieve data from
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //insert data into the current vertex buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    //binds the current vertex buffer to the pos attribute in the shader
    gl.vertexAttribPointer(programInfo.attribLocations.pos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.pos);

    if (normals.length) {
        let normalBuffer = gl.createBuffer();
        //vertexBuffer is now current buffer retrieve data from
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        //insert data into the current normal buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
        //binds the current vertex buffer to the pos attribute in the shader
        gl.vertexAttribPointer(programInfo.attribLocations.norm, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.norm);
    }
}

function drawPlane(gl, programInfo, color, dimensions, base) {
    let vertices = get2DPlaneFromDim(...dimensions, base);
    loadGeometry(gl, programInfo, vertices);
    gl.uniform4f(programInfo.uniformLocations.color, color[0], color[1], color[2], 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
}

function drawMesh(gl, programInfo, mesh) {
    gl.useProgram(programInfo.program);
    loadMeshBuffers(gl, programInfo, mesh);
    gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

// function drawLine(gl, programInfo, state, color, pointA, pointB) {
//     loadGeometry(gl, programInfo, pointA.concat(pointB))
//     gl.uniform4f(programInfo.uniformLocations.color, ...color, 1);
//     gl.drawArrays(gl.LINES, 0, 2);
//
// }
//
function drawAxes(gl, programInfo) {
    let thickness = 0.01;
    let length = 1;

    drawPlane(gl, programInfo, [1, 0, 0], [length, thickness], [0, 0, 0]);
    drawPlane(gl, programInfo, [0, 1, 0], [thickness, length], [0, 0, 0]);
}