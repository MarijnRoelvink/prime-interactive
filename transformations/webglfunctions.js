function clearScreen(gl) {
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
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

    drawPlane(gl, programInfo, [1, 1, 1], [length, thickness], [-thickness/2, -thickness/2, 0]);
    drawPlane(gl, programInfo, [1, 1, 1], [thickness, length], [-thickness/2, -thickness/2, 0]);
}