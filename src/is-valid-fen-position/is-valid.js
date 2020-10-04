"use strict";
var IsValid = /** @class */ (function () {
    function IsValid(worker) {
        this.worker = worker;
        this.position = this.worker.position;
        this.options = this.worker.options;
        this.initOptions();
        this.initState();
        this.initScan();
        this.checkers();
    }
    Object.defineProperty(IsValid, "PATTERN_PART", {
        get: function () {
            return /^(r|n|b|q|k|p)$/i;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IsValid, "ASSOCIATE_PARTS_TO_CHECKER_PART", {
        get: function () {
            return {
                "pawn": "isValidTimesPawns",
                "king": "isValidTimesKings",
                "queen": "isValidTimesQueens",
                "rook": "isValidTimesRooks",
                "bishop": "isValidTimesBishops",
                "knight": "isValidTimesKnights"
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IsValid, "ASSOCIATE_PARTS_TO_SCAN_PART", {
        get: function () {
            return {
                "pawn": {
                    all: "countPawns",
                    white: "countWhitePawns",
                    black: "countBlackPawns"
                },
                "queen": {
                    all: "countQueens",
                    white: "countWhiteQueens",
                    black: "countBlackQueens"
                },
                "rook": {
                    all: "countRooks",
                    white: "countWhiteRooks",
                    black: "countBlackRooks"
                },
                "bishop": {
                    all: "countBishops",
                    white: "countWhiteBishops",
                    black: "countBlackBishops"
                },
                "knight": {
                    all: "countKnights",
                    white: "countWhiteKnights",
                    black: "countBlackKnights"
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    IsValid.normalizePartName = function (partName) {
        if (/^p$/i.test(partName)) {
            return "pawn";
        }
        else if (/^k$/i.test(partName)) {
            return "king";
        }
        else if (/^q$/i.test(partName)) {
            return "queen";
        }
        else if (/^r$/i.test(partName)) {
            return "rook";
        }
        else if (/^n$/i.test(partName)) {
            return "knight";
        }
        else if (/^b$/i.test(partName)) {
            return "bishop";
        }
        return null;
    };
    IsValid.prototype.checkerRowsSize = function () {
        var isFindIlegalRowSize = false;
        var rows = this.position.split(this.options.separator);
        rows.forEach(function (row) {
            var size = 0;
            var chars = row.split('');
            chars.forEach(function (char) {
                if (!isNaN(parseInt(char))) {
                    size += parseInt(char);
                }
                else {
                    size++;
                }
            });
            if (size !== 8) {
                isFindIlegalRowSize = true;
            }
        });
        if (isFindIlegalRowSize) {
            this.state.isValidNumberCharsBetweenDash = false;
        }
    };
    IsValid.prototype.checkerParts = function () {
        var countParts = 0;
        var countWhiteParts = 0;
        var countBlackParts = 0;
        this.position.split('').forEach(function (char) {
            if (IsValid.PATTERN_PART.test(char)) {
                countParts++;
                if (char === char.toLocaleUpperCase()) {
                    countWhiteParts++;
                }
            }
        });
        countBlackParts = (countParts - countWhiteParts);
        if (countParts > 32 || countParts < 2) {
            this.state.isValidParts = false;
        }
        if (countWhiteParts > 16 || countWhiteParts < 1) {
            this.state.isValidPartsByPlayer = false;
        }
        if (countBlackParts > 16 || countBlackParts < 1) {
            this.state.isValidPartsByPlayer = false;
        }
        this.scan.countParts = countParts;
        this.scan.countWhiteParts = countWhiteParts;
        this.scan.countBlackParts = countBlackParts;
    };
    IsValid.prototype.checkTimesParts = function (partName, times) {
        var attributeChecker = this.getCheckerPartsByPartName(partName);
        var attributesScan = this.getScanPartByPartName(partName);
        if (typeof attributeChecker !== "string") {
            return;
        }
        var countPartsWhite = 0;
        var countPartsBlack = 0;
        var chars = this.position.split('');
        chars.forEach(function (char) {
            var partRegex = new RegExp("^" + partName + "$", "i");
            if (partRegex.test(char)) {
                // is white part
                if (char.toLocaleUpperCase() === char) {
                    countPartsWhite++;
                }
                else {
                    countPartsBlack++;
                }
            }
        });
        if (countPartsBlack > times || countPartsWhite > times) {
            this.state[attributeChecker] = false;
        }
        if (attributesScan) {
            this.scan[attributesScan.all] = (countPartsWhite + countPartsBlack);
            this.scan[attributesScan.white] = countPartsWhite;
            this.scan[attributesScan.black] = countPartsBlack;
        }
    };
    IsValid.prototype.checkKings = function () {
        var isExistsWhiteKing = this.position.indexOf('K') !== -1;
        var isExistsBlackKing = this.position.indexOf('k') !== -1;
        if (!isExistsWhiteKing || !isExistsBlackKing) {
            this.state.isExistsKings = false;
        }
    };
    IsValid.prototype.checkNumberRows = function () {
        var rows = this.position.split(this.options.separator);
        this.state.isValidNumberRows = rows.length === 8;
    };
    IsValid.prototype.checkChars = function () {
        var isFoundIlegalChar = false;
        var chars = this.position.split('');
        var legalChars = ("rnbqkpRNBKQP12345678" + this.options.separator);
        chars.forEach(function (char) {
            if (legalChars.indexOf(char) === -1) {
                isFoundIlegalChar = true;
            }
        });
        if (isFoundIlegalChar) {
            this.state.isValidChars = false;
        }
    };
    Object.defineProperty(IsValid.prototype, "result", {
        get: function () {
            var response = {
                isValid: this.state.isValid,
                stats: this.state.attributes
            };
            if (this.state.details) {
                response.details = this.state.details;
            }
            if (this.state.warn) {
                response.warn = this.state.warn;
            }
            if (response.isValid) {
                response.scan = this.scan;
            }
            return response;
        },
        enumerable: false,
        configurable: true
    });
    IsValid.prototype.checkers = function () {
        this.checkNumberRows();
        this.checkChars();
        this.checkKings();
        this.checkTimesParts("p", 8);
        this.checkTimesParts("k", 1);
        this.checkTimesParts("r", 10);
        this.checkTimesParts("q", 9);
        this.checkTimesParts("n", 10);
        this.checkTimesParts("b", 10);
        this.checkerParts();
        this.checkerRowsSize();
    };
    IsValid.prototype.initScan = function () {
        this.scan = {
            countParts: null,
            countWhiteParts: null,
            countBlackParts: null,
            countPawns: null,
            countWhitePawns: null,
            countBlackPawns: null,
            countRooks: null,
            countWhiteRooks: null,
            countBlackRooks: null,
            countBishops: null,
            countWhiteBishops: null,
            countBlackBishops: null,
            countQueens: null,
            countWhiteQueens: null,
            countBlackQueens: null,
            countKnights: null,
            countWhiteKnights: null,
            countBlackKnights: null
        };
    };
    IsValid.prototype.initState = function () {
        var _this = this;
        // default all state checker is true
        // and each checker verify if is really true
        this.state = {
            isValidNumberRows: true,
            isValidChars: true,
            isExistsKings: true,
            isValidTimesPawns: true,
            isValidTimesKings: true,
            isValidTimesQueens: true,
            isValidTimesRooks: true,
            isValidTimesBishops: true,
            isValidTimesKnights: true,
            isValidNumberCharsBetweenDash: true,
            isValidParts: true,
            isValidPartsByPlayer: true,
            get isValid() {
                var minimalIsValid = (this.isValidNumberRows &&
                    this.isValidChars &&
                    this.isValidTimesPawns &&
                    this.isValidTimesKings &&
                    this.isValidTimesQueens &&
                    this.isValidTimesRooks &&
                    this.isValidTimesBishops &&
                    this.isValidTimesKnights &&
                    this.isValidNumberCharsBetweenDash &&
                    this.isValidParts &&
                    this.isValidPartsByPlayer);
                return minimalIsValid && (_this.options.isRequireKings ? this.isExistsKings : true);
            },
            get details() {
                var details = [];
                if (this.isValid) {
                    return null;
                }
                else if (!this.isValidNumberRows) {
                    details.push("should contains 8 rows");
                }
                else if (!this.isValidChars) {
                    details.push("contains invalid characters");
                }
                else if (!this.isExistsKings) {
                    details.push("kings missing ilegal position");
                }
                else if (!this.isValidTimesPawns) {
                    details.push("number pawns is invalid ilegal position");
                }
                else if (!this.isValidTimesKings) {
                    details.push("number kings is invalid ilegal position");
                }
                else if (!this.isValidTimesQueens) {
                    details.push("number queens is invalid ilegal position");
                }
                else if (!this.isValidTimesRooks) {
                    details.push("number rooks is invalid ilegal position");
                }
                else if (!this.isValidTimesBishops) {
                    details.push("number bishops is invalid ilegal position");
                }
                else if (!this.isValidTimesKnights) {
                    details.push("number knights is invalid ilegal position");
                }
                return details;
            },
            get warn() {
                if (!this.isValidNumberRows || !this.isValidNumberCharsBetweenDash) {
                    return "verify if row separator is really dash (/)";
                }
                else if (!this.isValidChars) {
                    return "verify if contains white space inside FEN position";
                }
                return null;
            },
            get attributes() {
                return {
                    isValidNumberRows: this.isValidNumberRows,
                    isValidChars: this.isValidChars,
                    isExistsKings: this.isExistsKings,
                    isValidTimesPawns: this.isValidTimesPawns,
                    isValidTimesKings: this.isValidTimesKings,
                    isValidTimesQueens: this.isValidTimesQueens,
                    isValidTimesRooks: this.isValidTimesRooks,
                    isValidTimesBishops: this.isValidTimesBishops,
                    isValidTimesKnights: this.isValidTimesKnights,
                    isValidNumberCharsBetweenDash: this.isValidNumberCharsBetweenDash,
                    isValidParts: this.isValidParts,
                    isValidPartsByPlayer: this.isValidPartsByPlayer,
                };
            }
        };
    };
    IsValid.prototype.initOptions = function () {
        this.options = this.options || {};
        var options = {
            isRequireKings: this.options.isRequireKings || true,
            separator: this.options.separator || "/"
        };
        this.options = options;
    };
    IsValid.prototype.getCheckerPartsByPartName = function (partName) {
        var partNormalize = IsValid.normalizePartName(partName);
        if (!partNormalize) {
            return null;
        }
        if (partNormalize in IsValid.ASSOCIATE_PARTS_TO_CHECKER_PART) {
            return IsValid.ASSOCIATE_PARTS_TO_CHECKER_PART[partNormalize];
        }
        return null;
    };
    IsValid.prototype.getScanPartByPartName = function (partName) {
        var partNormalize = IsValid.normalizePartName(partName);
        if (!partNormalize) {
            return null;
        }
        if (partNormalize in IsValid.ASSOCIATE_PARTS_TO_SCAN_PART) {
            return IsValid.ASSOCIATE_PARTS_TO_SCAN_PART[partNormalize];
        }
        return null;
    };
    return IsValid;
}());
module.exports = IsValid;
