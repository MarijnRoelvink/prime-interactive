class Matrix {
    constructor() {
        this.matrix = [[1, 0], [0, 1]];
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
        this.updateHTMLSystem();
    }


}