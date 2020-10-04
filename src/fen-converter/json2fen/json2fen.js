"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var json2array_1 = __importDefault(require("./../json2array/json2array"));
var array2fen_1 = __importDefault(require("./../array2fen/array2fen"));
function json2fen(jsonFen) {
    return array2fen_1.default(json2array_1.default(jsonFen));
}
module.exports = json2fen;
