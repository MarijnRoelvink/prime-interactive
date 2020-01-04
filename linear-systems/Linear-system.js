class LinearSystem {
    constructor() {
        this.planes = [[1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 13]]; //each row = [a, b, c, ans]
        this.oldPlanes = [];
        this.currOperation = "";
        this.registerHTMLChanges();
        this.updateHTMLSystem();
    }

    registerHTMLChanges() {
        let self = this;
        $("#user-input td input").each(function () {
            let index = this.id.split("-");
            let rowIndex = index[1] - 1;
            let colIndex = index[2] - 1;

            this.onfocus = function () {
                if (self.currOperation !== "") {
                    document.getElementById("error-audio").play();
                    showMsg("Matrix changes are not allowed while performing row operations", "normal", 300);
                }
                this.value = self.planes[rowIndex][colIndex];
            };
            this.onblur = function () {
                console.log("no focus!");
              this.value = Math.round(self.planes[rowIndex][colIndex]*100)/100;;
            };
            this.onchange = function () {
                self.planes[rowIndex][colIndex] = parseFloat(this.value);
            }
        });
        $("#row-addition-btn").click(function () {
            self.toggleTab('row-addition');
        });
        $("#row-switching-btn").click(function () {
            self.toggleTab('row-switching');
        });
        $("#row-multiplication-btn").click(function () {
            self.toggleTab('row-multiplication');
        });
    }

    updateHTMLSystem() {
        for (let i = 0; i < 3; i++) {
            let selector = ".row-" + (i + 1) + " input";
            let inputs = $(selector).toArray();
            for (let j = 0; j < 4; j++) {
                inputs[j].value = Math.round(this.planes[i][j]*100)/100;
            }
        }
    }

    update() {
        if (this.currOperation !== "") {
            this.planes = [...this.oldPlanes];
            switch (this.currOperation) {
                case "row-addition":
                    this.updateRowAddition();
                    break;
                case "row-switching":
                    this.updateRowSwitching();
                    break;
                case "row-multiplication":
                    this.updateRowMultiplication();
                    break;
            }
            this.updateHTMLSystem();
        }
        this.checkEquations();

    }

    updateRowAddition() {
        if ($("#add-row1")[0].validity.valid && $("#add-row2")[0].validity.valid) {
            let factor = parseFloat($("#add-slider").val());
            let row1 = parseInt($("#add-row1").val() - 1);
            let row2 = parseInt($("#add-row2").val() - 1);
            this.planes[row2] = rowAddition(this.oldPlanes[row1], this.oldPlanes[row2], factor);
        }
    }

    updateRowSwitching() {
        if ($("#switch-row1")[0].validity.valid && $("#switch-row2")[0].validity.valid) {
            let row1 = $("#switch-row1").val() - 1;
            let row2 = $("#switch-row2").val() - 1;
            this.planes[row1] = [...this.oldPlanes[row2]];
            this.planes[row2] = [...this.oldPlanes[row1]];
        }
    }

    updateRowMultiplication() {
        if ($("#mul-row")[0].validity.valid) {
            let factor = parseFloat($("#mul-slider").val());
            let row = parseInt($("#mul-row").val()) - 1;
            this.planes[row] = rowMultiplication([...this.oldPlanes[row]], factor);
        }
    }

    applyEdit() {
        this.oldPlanes = [...this.planes];
        $("#add-slider").val(0);
        $("#mul-slider").val(1);
        this.toggleTab(this.currOperation);
    }

    cancelEdit() {
        this.toggleTab(this.currOperation);
    }

    toggleTab(value) {
        //set everything to non-active
        $(".operations-tab").each(function () {
            $(this).css('display', 'none');
        });
        $(".row-ops-btn").each(function () {
            $(this).removeClass("btn-primary").addClass("btn-secondary");
        });

        let lastOperation = this.currOperation;
        if (this.currOperation !== "") {
            //cancel current editing
            this.planes = [...this.oldPlanes];
            this.currOperation = "";
        }
        if (lastOperation !== value) {
            //start editing
            this.oldPlanes = [...this.planes];
            this.currOperation = value;
            $("#" + value).css('display', 'flex');
            $("#" + value + "-btn").removeClass("btn-secondary").addClass("btn-primary");
        }
        this.updateHTMLSystem();
    }

    checkEquations() {
        for (let i = 0; i < 3; i++) {
            let leftIsZero = true;
            for (let j = 0; j < 3; j++) {
                leftIsZero = leftIsZero && this.planes[i][j] === 0;
            }
            if (leftIsZero) {
                if (this.planes[i][3] !== 0) {
                    showMsg("Row " + (i + 1) + " is inconsistent", "error");
                } else {
                    showMsg("Row " + (i + 1) + " does not define a plane but all points in the space.");
                }
            }
        }
    }
}
