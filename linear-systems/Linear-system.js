class LinearSystem {
    constructor() {
        this.planes = []; //each row = [a, b, c, ans]
        this.oldPlanes = [];
        this.currOperation = "";
        this.getSystemFromHTML();
        this.registerHTMLChanges();
    }

    registerHTMLChanges() {
        let self = this;
        $("#user-input td input").each(function () {
            this.onchange = function () {
                self.getSystemFromHTML();
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

    getSystemFromHTML() {
        this.planes = [];
        for (let i = 0; i < 3; i++) {
            let selector = ".row-" + (i + 1) + " input";
            let inputs = $(selector).toArray();
            this.planes.push([]);
            for (let j = 0; j < 4; j++) {
                this.planes[i].push(parseFloat(inputs[j].value));
            }
        }
    }

    updateHTMLSystem() {
        for (let i = 0; i < 3; i++) {
            let selector = ".row-" + (i + 1) + " input";
            let inputs = $(selector).toArray();
            for (let j = 0; j < 4; j++) {
                inputs[j].value = this.planes[i][j];
            }
        }
    }

    update() {
        if (this.currOperation === "") {
            return;
        }
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

    updateRowAddition() {
        if ($("#add-row1")[0].validity.valid && $("#add-row2")[0].validity.valid) {
            let factor = parseFloat($("#add-slider").val());
            let row1 = parseInt($("#add-row1").val() - 1);
            let row2 = parseInt($("#add-row2").val() - 1);
            this.planes[row2] = rowAddition(this.oldPlanes[row1], this.oldPlanes[row2], factor);
        }
    }

    updateRowSwitching() {
        if($("#switch-row1")[0].validity.valid && $("#switch-row2")[0].validity.valid) {
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

    toggleTab(value) {
        //set everything to non-active
        $(".operations-tab").each(function () {
            $(this).css('display', 'none');
        });
        $(".row-ops-btn").each(function () {
            $(this).removeClass("btn-primary").addClass("btn-secondary");
        });

        if (this.currOperation === value) {
            //cancel editing
            this.planes = [...this.oldPlanes];
            this.currOperation = "";
        } else {
            //start editing
            this.oldPlanes = [...this.planes];
            this.currOperation = value;
            $("#" + value).css('display', 'flex');
            $("#" + value + "-btn").removeClass("btn-secondary").addClass("btn-primary");
        }
        this.updateHTMLSystem();
    }
}
