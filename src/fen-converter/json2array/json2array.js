"use strict";
function generateSquares() {
    var squares = [];
    for (var col = 8; col > 0; col--) {
        for (var row = 7; row >= 0; row--) {
            squares.push("" + "abcdefgh".charAt(row) + col);
        }
    }
    return squares;
}
function getNormalizePartName(partName) {
    if (partName.length === 1) {
        return partName;
    }
    else {
        var color = partName.charAt(1);
        if (color === "b") {
            return (partName.charAt(0)).toLocaleLowerCase();
        }
        else {
            return (partName.charAt(0)).toLocaleUpperCase();
        }
    }
}
function json2array(jsonFen) {
    var squares = Object.keys(jsonFen);
    var allSquares = generateSquares();
    // normalize json fen
    // add empty square
    if (squares.length < 64) {
        allSquares.forEach(function (square) {
            if (!jsonFen[square]) {
                // empty square
                jsonFen[square] = "";
            }
        });
    }
    var arrayFen = [];
    var rowSize = 0;
    var rowArrayFen = [];
    allSquares.forEach(function (square) {
        if (typeof jsonFen[square] !== "string" ||
            !/^(r|n|b|q|k|p)(b|w)?$/i.test(jsonFen[square])) {
            // empty square
            rowArrayFen.push("");
        }
        else {
            var partName = getNormalizePartName(jsonFen[square]);
            rowArrayFen.push(partName);
        }
        rowSize++;
        // check end row
        if (rowSize >= 8) {
            rowSize = 0;
            arrayFen.push(rowArrayFen.reverse());
            rowArrayFen = [];
        }
    });
    return arrayFen;
}
module.exports = json2array;
