class Matrix {
    constructor() {
        this.matrix = [[1, 0],
            [0, 1]];
        this.locked = true;
        this.registerHTMLChanges();
        this.updateHTMLSystem();
    }

    registerHTMLChanges() {
        let self = this;
        $("#transformation-matrix td input").each(function () {
            let index = this.id.split("-");
            let rowIndex = index[1] - 1;
            let colIndex = index[2] - 1;

            this.onchange = function () {
                console.log(this.value);
                self.matrix[rowIndex][colIndex] = parseFloat(this.value);
            }
        })
    }

    updateHTMLSystem() {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                let selector = "#m-" + (i + 1) + "-" + (j + 1);
                $(selector).val(Math.round(this.matrix[i][j] * 100) / 100);
            }
        }
    }

    getGlMatrix() {
        //glMatrix wants to receive values row-first instead of column first.
        // For the sake of easy reading i feed them column first before transposing
        return mat4.transpose(mat4.create(), mat4.fromValues(
            this.matrix[0][0], this.matrix[0][1], 0, 0,
            this.matrix[1][0], this.matrix[1][1], 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1));
    }

    from4Dto2DMatrix(matrix) {
        this.matrix = [[matrix[0], matrix[4]],
            [matrix[1], matrix[5]]];
    }

    addTransformWrongly(x, y, vector) {
        let tv = vec3.transformMat4(vec3.create(), vector, this.getGlMatrix());
        let add1 = tv[1] !== 0 ? x / tv[1] : 0;
        let add2 = tv[0] !== 0 ? y / tv[0] : 0;
        let transformed = mat4.transpose(mat4.create(), mat4.fromValues(
            1, add1, 0, 0,
            add2, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1));
        mat4.mul(transformed, transformed, this.getGlMatrix());
        this.from4Dto2DMatrix(transformed);
        this.updateHTMLSystem();
    }

    addTransform(x, y, v) {
        let tv = new Vector(vec3.transformMat4(vec3.create(), v.vector, this.getGlMatrix()));
        tv.transform(x, y);

        let scale = vec3.len(tv.vector) / vec3.len(v.vector);
        let angle = tv.getXAxisAngle() - v.getXAxisAngle();

        let m = mat4.fromRotation(mat4.create(), angle, [0, 0, 1]);
        this.from4Dto2DMatrix(mat4.scale(m, m, [scale, scale, 0]));
        this.updateHTMLSystem();
    }

    getTransformedVector(vector) {
        return vec3.transformMat4(vec3.create(), vector, this.getGlMatrix());
    }


}