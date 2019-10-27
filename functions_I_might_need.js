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
