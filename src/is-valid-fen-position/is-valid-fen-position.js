"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var is_valid_1 = __importDefault(require("./is-valid"));
function isValidFenPosition(worker) {
    return new is_valid_1.default(worker).result;
}
module.exports = isValidFenPosition;
