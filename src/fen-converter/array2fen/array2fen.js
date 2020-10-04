"use strict";
function array2fen(fenArray, separatorRow) {
    if (separatorRow === void 0) { separatorRow = "/"; }
    var fen = "";
    fenArray.forEach(function (row) {
        var countempty = 0;
        row.forEach(function (char) {
            if (char === "") {
                countempty++;
            }
            else {
                if (countempty > 0) {
                    fen += countempty;
                    countempty = 0;
                }
                fen += char;
            }
        });
        if (countempty > 0) {
            fen += countempty;
            countempty = 0;
        }
        fen += separatorRow;
    });
    // remove last char because is a row separator
    return fen.slice(0, -1);
}
module.exports = array2fen;
