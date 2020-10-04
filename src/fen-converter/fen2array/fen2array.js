"use strict";
function fen2array(fen) {
    var rowChars = [];
    var transform = [];
    fen.split('/').forEach(function (row) {
        row.split('').forEach(function (char) {
            if (isNaN(parseInt(char))) {
                rowChars.push(char);
            }
            else {
                var emptySquares = parseInt(char);
                for (var i = 0; i < emptySquares; i++) {
                    rowChars.push("");
                }
            }
        });
        transform.push(rowChars);
        rowChars = [];
    });
    return transform;
}
module.exports = fen2array;
