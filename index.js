let defaultPrp = {
    "text": "",
    "font-weight": "",
    "font-style": "",
    "text-decoration": "",
    "text-align": "left",
    "background-color": "#ffffff",
    "color": "#000000",
    "font-family": "Calibri",
    "font-size": "16px"
};

let cellData = {
    "Sheet1": {}
}

let selectedSheet = "Sheet1";
let lastAddedSheet = 1;



$(document).ready(function () {


    for (let i = 1; i <= 100; i++) {

        let str = "";
        let n = i;
        while (n > 0) {

            let rem = n % 26;
            if (rem > 0) {
                str = String.fromCharCode(rem + 64) + str;
            } else {
                str = "Z" + str;
                n--;
            }
            n = Math.floor(n / 26);
        }

        let column = $(`<div class="colName colId-${i}" id="colCode-${str}">${str}</div>`);
        $(".column-name-container").append(column);

        let row = $(`<div class="rowName" id="rowId-${i}">${i}</div>`);
        $(".row-name-container").append(row);

    }

    for (let i = 1; i <= 100; i++) {
        let row = $(`<div class="cell-row"></div>`);
        for (let j = 1; j <= 100; j++) {
            let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
            let cell = $(`<div id="row-${i}-col-${j}" class="input-cell" contenteditable="false" data="code-${colCode}"></div>`);
            row.append(cell);
        }
        $(".cell-container").append(row);
    }

    function changeHeader(ele) {

        let [rowId, colId] = getRowCol(ele);
        let cellInfo = defaultPrp;
        if (cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]) {
            cellInfo = cellData[selectedSheet][rowId][colId];
        }
        cellInfo["font-weight"] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected");
        cellInfo["font-style"] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected");
        cellInfo["text-decoration"] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected");
        let alignment = cellInfo["text-align"];
        $(".align-icon.selected").removeClass("selected");
        $(`.icon-${alignment}-align`).addClass("selected");
        let bgColor = cellInfo["background-color"];
        $(".cp-bg").val(bgColor);
        let textColor = cellInfo["color"];
        $(".cp-text").val(textColor);
        $(".font-family-selector").val(cellInfo["font-family"]);
        $(".font-family-selector").css("font-family", cellInfo["font-family"]);
        $(".font-size-selector").val(cellInfo["font-size"]);

    }



    $(".input-cell").click(function (e) {
        let [rowId, colId] = getRowCol(this);
        if (e.ctrlKey) {
            $(this).addClass("selected");

            if (rowId > 1) {
                let topCellSelected = $(`#row-${rowId - 1}-col-${colId}`).hasClass("selected");
                if (topCellSelected) {
                    $(`#row-${rowId - 1}-col-${colId}`).addClass("bottom-cell-selected");
                    $(this).addClass("top-cell-selected");
                }
            }
            if (rowId < 99) {
                let bottomCellSelected = $(`#row-${rowId + 1}-col-${colId}`).hasClass("selected");
                if (bottomCellSelected) {
                    $(`#row-${rowId + 1}-col-${colId}`).addClass("top-cell-selected");
                    $(this).addClass("bottom-cell-selected");
                }
            }
            if (colId > 1) {
                let leftCellSelected = $(`#row-${rowId}-col-${colId - 1}`).hasClass("selected");
                if (leftCellSelected) {
                    $(`#row-${rowId}-col-${colId - 1}`).addClass("right-cell-selected");
                    $(this).addClass("left-cell-selected");
                }
            }
            if (colId < 99) {
                let rightCellSelected = $(`#row-${rowId}-col-${colId + 1}`).hasClass("selected");
                if (rightCellSelected) {
                    $(`#row-${rowId}-col-${colId + 1}`).addClass("left-cell-selected");
                    $(this).addClass("right-cell-selected");
                }
            }

        }
        else {

            $(".input-cell.selected").removeClass("top-cell-selected");
            $(".input-cell.selected").removeClass("bottom-cell-selected");
            $(".input-cell.selected").removeClass("right-cell-selected");
            $(".input-cell.selected").removeClass("left-cell-selected");
            $(".input-cell.selected").removeClass("selected");
            $(this).addClass("selected");

            colId = String.fromCharCode(colId + 64);
            $(".selected-cell").html(`${colId}${rowId}`);

        }

        changeHeader(this);



    })


    $(".formula-input").keypress(function (e) {
        if (e.keyCode == '13') {
            $(this).blur();
            let formula = $(".formula-input").val();
            formula = formula.split(" ");
            for (let i = 0; i < formula.length; i++) {

                if (formula[i].charCodeAt(0) >= 65 && formula[i].charCodeAt(0) <= 90) {
                    let col = formula[i].charAt(0);
                    let colId = col.charCodeAt(col);
                    colId = parseInt(colId);
                    let rowId = formula[i].substring(1);
                    rowId = parseInt(rowId);
                    // let cell = $(`#row-${rowId}-col-${colId}`);
                    let val = cellData[selectedSheet][rowId][colId - 64]["text"];
                    formula[i] = val;
                   
                }
                

            }
            formula = formula.join(" ");
            console.log(formula);
            let result = eval(formula);
            $(".input-cell.selected").text(result);
            
        }
    })



    $(".input-cell").dblclick(function () {

        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable", "true");
        $(this).focus();

    })

    $(".input-cell").blur(function () {
        $(".input-cell").attr("contenteditable", "false");
        updateCell("text", $(this).text(), true);
    })

    $(".cell-container").scroll(function () {
        $(".row-name-container").scrollTop(this.scrollTop);
        $(".column-name-container").scrollLeft(this.scrollLeft);

    })

    function getRowCol(cell) {
        let idArr = $(cell).attr("id").split("-");
        let rowId = parseInt(idArr[1]);
        let colId = parseInt(idArr[3]);
        return [rowId, colId];
    }

    $(".icon-bold").click(function () {
        if ($(this).hasClass("selected")) {
            updateCell("font-weight", "", true);
        } else {
            updateCell("font-weight", "bold", false);
        }
    })
    $(".icon-italic").click(function () {
        if ($(this).hasClass("selected")) {
            updateCell("font-style", "", true);
        } else {
            updateCell("font-style", "italic", false);
        }
    })
    $(".icon-underline").click(function () {
        if ($(this).hasClass("selected")) {
            updateCell("text-decoration", "", true);
        } else {
            updateCell("text-decoration", "underline", false);
        }
    })

    $(".icon-left-align").click(function () {
        $(".align-icon.selected").removeClass("selected");
        if (!$(this).hasClass("selected")) {
            $(this).addClass("selected");
            updateCell("text-align", "left", true);
        }

    })

    $(".icon-center-align").click(function () {
        $(".align-icon.selected").removeClass("selected");
        if (!$(this).hasClass("selected")) {
            $(this).addClass("selected");
            updateCell("text-align", "center", false);
        }


    })
    $(".icon-right-align").click(function () {
        $(".align-icon.selected").removeClass("selected");
        if (!$(this).hasClass("selected")) {
            $(this).addClass("selected");
            updateCell("text-align", "right", false);
        }


    })

    $(".style-icon").click(function () {
        $(this).toggleClass("selected");
    });

    $(".icon-color-fill").click(function () {
        $(".cp-bg").click();
    })
    $(".cp-bg").change(function () {
        updateCell("background-color", $(this).val(), true);
    })

    $(".icon-color-text").click(function () {
        $(".cp-text").click();
    })
    $(".cp-text").change(function () {
        updateCell("color", $(this).val(), true);
    })

    $(".font-family-selector").change(function () {
        updateCell("font-family", $(this).val(), true);
        $(".font-family-selector").css("font-family", $(this).val());
    })

    $(".font-size-selector").change(function () {
        updateCell("font-size", $(this).val(), true);
    });

    $(".icon-add").click(function () {
        emptySheet();
        let ele = `<div class="sheet-tab selected">Sheet ${lastAddedSheet + 1}</div>`;
        lastAddedSheet += 1;
        let sheetName = "Sheet" + lastAddedSheet;
        cellData[sheetName] = {};
        selectedSheet = sheetName;
        $(".sheet-tab-container").append(ele);
        $(".sheet-tab.selected").removeClass("selected");
        $(`div:contains('Sheet ${lastAddedSheet}')`).addClass("selected");
        $(`div:contains('Sheet ${lastAddedSheet}')`).addClass("selected");
        $(".sheet-tab.selected").click(function () {
            if (!$(this).hasClass("selected")) {
                selectSheet(this);
            }
        })

    })

    $(".sheet-tab").click(function () {
        if (!$(this).hasClass("selected")) {
            selectSheet(this);
        }
    })



    function selectSheet(ele) {
        let sheet = $(ele).html().split(" ");

        // alert(selectedSheet);
        $(".sheet-tab.selected").removeClass("selected");
        $(ele).addClass("selected");
        emptySheet();
        selectedSheet = sheet[0] + sheet[1];
        loadSheet();
    }





    function updateCell(property, value, defaultPossible) {
        $(".input-cell.selected").each(function () {
            $(this).css(property, value);

            let [rowId, colId] = getRowCol(this);

            if (cellData[selectedSheet][rowId]) {
                if (cellData[selectedSheet][rowId][colId]) {
                    cellData[selectedSheet][rowId][colId][property] = value;
                } else {
                    cellData[selectedSheet][rowId][colId] = { ...defaultPrp };
                    cellData[selectedSheet][rowId][colId][property] = value;
                }
            } else {
                cellData[selectedSheet][rowId] = {};
                cellData[selectedSheet][rowId][colId] = { ...defaultPrp };
                cellData[selectedSheet][rowId][colId][property] = value;
            }

            if (defaultPossible) {

                if (JSON.stringify(defaultPrp) == JSON.stringify(cellData[selectedSheet][rowId][colId])) {
                    delete cellData[selectedSheet][rowId][colId];
                    if (Object.keys(cellData[selectedSheet][rowId]).length == 0) {
                        delete cellData[selectedSheet][rowId];
                    }
                }

            }

        });
        console.log(cellData);

    }

    function emptySheet() {
        for (let i of Object.keys(cellData[selectedSheet])) {
            for (let j of Object.keys(cellData[selectedSheet][i])) {
                let cell = $(`#row-${i}-col-${j}`);
                cell.text("");
                cell.css("background-color", "#ffffff");
                cell.css("color", "#000000");
                cell.css("font-weight", "");
                cell.css("font-style", "");
                cell.css("text-decoration", "");
                cell.css("text-align", "left");
                cell.css("font-size", "16px");
                cell.css("font-family", "Calibri");
            }
        }

        // $(".icon-bold").removeClass("selected");
        // $(".icon-italic").removeClass("selected");
        // $(".icon-underline").removeClass("selected");
        // $(".icon-left-align").addClass("selected");
        // $(".icon-center-align").removeClass("selected");
        // $(".icon-right-align").removeClass("selected");
        // $(".font-family-selector").val("Calibri");
        // $(".font-size-selector").val("16px");
        // $(".cp-bg").val("#ffffff");
        // $(".cp-text").val("#000000");

        console.log(cellData);
    }

    function loadSheet() {
        for (let i of Object.keys(cellData[selectedSheet])) {
            for (let j of Object.keys(cellData[selectedSheet][i])) {
                let cell = $(`#row-${i}-col-${j}`);
                let cellInfo = cellData[selectedSheet][i][j];
                cell.text(cellInfo["text"]);
                cell.css("background-color", cellInfo["background-color"]);
                cell.css("color", cellInfo["color"]);
                cell.css("font-weight", cellInfo["font-weight"]);
                cell.css("font-style", cellInfo["font-style"]);
                cell.css("text-decoration", cellInfo["text-decoration"]);
                cell.css("text-align", cellInfo["text-align"]);
                cell.css("font-size", cellInfo["font-size"]);
                cell.css("font-family", cellInfo["font-family"]);
            }
        }



    }

    $(".clearSheet").click(function () {
        emptySheet();
        let sheet = $(".sheet-tab.selected").text().split(" ");
        let sheetName = sheet[0] + sheet[1];
        cellData[sheetName] = {};
    })



});





