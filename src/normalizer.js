"use strict";
function normalizer(fen) {
    if (typeof fen !== "string") {
        throw new TypeError("arg1: fen, should be a string value");
    }
    else if (!fen.length) {
        throw new RangeError("arg1: fen, is not a valid fen position");
    }
    var fenElements = fen.split(' ');
    if (fenElements.length < 6) {
        while (fenElements.length < 6) {
            fenElements.push(null);
        }
    }
    else if (fenElements.length > 6) {
        var compose = fenElements.slice(0, 6);
        return compose;
    }
    return fenElements;
}
module.exports = normalizer;
