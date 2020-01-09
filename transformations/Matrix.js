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
                let selector = "#m-" + (i + 1) + "-" + (j+1);
                $(selector).val(this.matrix[i][j]);
            }
        }
    }

    update() {
    }

    getGlMatrix() {
        //glMatrix wants to receive values row-first instead of column first.
        // For the sake of easy reading i feed them column first before transposing
        return mat4.transpose(mat4.create(), mat4.fromValues(
            this.matrix[0][0], this.matrix[0][1], 0, 0,
            this.matrix[1][0], this.matrix[1][1], 0, 0,
            0,                 0,                 1, 0,
            0,                 0,                 0, 1));
    }

    toggleMode() {
        this.locked = !this.locked;
        $("#lock img").attr("src",
            this.locked? "../assets/icons/locked.svg" : "../assets/icons/unlocked.svg");
    }


}