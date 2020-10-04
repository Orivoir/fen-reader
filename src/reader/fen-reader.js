"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizer = exports.isValidFenPosition = exports.converters = exports.createFenReader = void 0;
var array2fen_1 = __importDefault(require("./../fen-converter/array2fen/array2fen"));
var fen2array_1 = __importDefault(require("./../fen-converter/fen2array/fen2array"));
var json2array_1 = __importDefault(require("./../fen-converter/json2array/json2array"));
var fen2json_1 = __importDefault(require("./../fen-converter/fen2json/fen2json"));
var json2fen_1 = __importDefault(require("./../fen-converter/json2fen/json2fen"));
var normalizer_1 = __importDefault(require("./../normalizer"));
exports.normalizer = normalizer_1.default;
var is_valid_fen_position_1 = __importDefault(require("./../is-valid-fen-position/is-valid-fen-position"));
exports.isValidFenPosition = is_valid_fen_position_1.default;
/**
 * @classdesc wrap fen converters and checker/scanner position
 */
var FenReader = /** @class */ (function () {
    function FenReader(position) {
        if (typeof position === "string") {
            this.setPosition(position);
        }
    }
    /**
    * @description remove current position save before add new position
    */
    FenReader.prototype.clear = function () {
        this.currentFenPosition = null;
        this.moveTo = null;
        this.castlings = null;
        this.semiMove = null;
        this.moveTo = null;
        this.notedMove = null;
        this.isValidFenResponse = null;
    };
    /**
     * @see FenReaderInterface
     */
    FenReader.prototype.setPosition = function (position) {
        this.clear();
        if (typeof position === "string") {
            this.currentFenPosition = position;
        }
        else if (position instanceof Array) {
            this.currentFenPosition = array2fen_1.default(position);
        }
        else if (typeof position === "object") {
            this.currentFenPosition = json2fen_1.default(position);
        }
        else {
            throw new TypeError('arg1: position, should be: string | Array<string[]> | {[keyname: string]: string}');
        }
        var fenPositionNormalized = normalizer_1.default(this.currentFenPosition);
        this.currentFenPosition = fenPositionNormalized[0];
        this.moveTo = fenPositionNormalized[1];
        this.castlings = fenPositionNormalized[2];
        this.notedMove = fenPositionNormalized[3];
        this.semiMove = fenPositionNormalized[4] !== null ? parseInt(fenPositionNormalized[4]) : null;
        this.countMoves = fenPositionNormalized[5] !== null ? parseInt(fenPositionNormalized[5]) : null;
        this.isValidFenResponse = is_valid_fen_position_1.default({
            position: this.currentFenPosition
        });
        return this.isValidFenResponse.isValid;
    };
    Object.defineProperty(FenReader.prototype, "whiteCastling", {
        get: function () {
            if (this.castlings === null) {
                return null;
            }
            else if (this.castlings === "-") {
                return "-";
            }
            else {
                if (this.castlings.indexOf('KQ') !== -1) {
                    return "KQ";
                }
                else {
                    return "-";
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FenReader.prototype, "blackCastling", {
        get: function () {
            if (this.castlings === null) {
                return null;
            }
            else if (this.castlings === "-") {
                return "-";
            }
            else {
                if (this.castlings.indexOf('kq') !== -1) {
                    return "kq";
                }
                else {
                    return "-";
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FenReader.prototype, "scan", {
        get: function () {
            return typeof this.isValidFenResponse.scan !== "undefined" ? this.isValidFenResponse.scan : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FenReader.prototype, "position", {
        get: function () {
            var _this = this;
            return {
                get fen() {
                    return _this.currentFenPosition;
                },
                get array() {
                    return typeof _this.currentFenPosition === "string" ? fen2array_1.default(_this.currentFenPosition) : null;
                },
                get json() {
                    return typeof _this.currentFenPosition === "string" ? fen2json_1.default(_this.currentFenPosition) : null;
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    return FenReader;
}());
var converters = {
    array2fen: array2fen_1.default,
    fen2array: fen2array_1.default,
    json2array: json2array_1.default,
    fen2json: fen2json_1.default,
    json2fen: json2fen_1.default
};
exports.converters = converters;
var createFenReader = function (position) {
    return new FenReader(position);
};
exports.createFenReader = createFenReader;
