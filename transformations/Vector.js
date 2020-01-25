class Vector {
    constructor(vec = [0, 0.5, 0], color = [1.0, 1.0, 1.0, 1.0], thickness = 0.01) {
        this.vector = vec;
        this.thickness = thickness;
        this.color = color;
    }

    getGLMatrix(matrix) {
        let transformedVec = [...this.vector];
        vec3.transformMat4(transformedVec, transformedVec, matrix);
        let scale = vec3.len(transformedVec);
        let angle = getXAxisAngle(transformedVec);
        let res = mat4.create();
        res[0] = scale;
        let rotMat = mat4.fromRotation(mat4.create(), angle, [0, 0, 1]);
        mat4.mul(res, rotMat, res);
        return res;
    }

    transform(x, y) {
        this.vector[0] += x;
        this.vector[1] += y;
    }

    draw(gl, state, programInfo, matrix, mesh) {
        gl.uniform4f(programInfo.uniformLocations.color, ...this.color);
        gl.uniformMatrix4fv(programInfo.uniformLocations.mvp, false, this.getGLMatrix(matrix));

        let vertices = get2DPlaneFromDim(1, this.thickness, [0, 0, 0]);
        loadGeometry(gl, programInfo, vertices);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
    }

    toString() {
        return this.vector[0] + ", " + this.vector[1];
    }
}