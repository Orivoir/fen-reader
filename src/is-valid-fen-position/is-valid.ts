import {
  FenPositionResponse,
  ScanResponse,
  FenPositionOptions,
  FenPosition,
  FenCharPosition,
  AssociatePartsToScanPart,
  Worker,
  State,
  StateAttributes
} from './is-valid-fen-position-head'

class IsValid {

  protected readonly worker: Worker
  protected state: State
  protected scan: ScanResponse

  public readonly position: FenPosition
  public options?: FenPositionOptions

  static get PATTERN_PART(): RegExp {

    return /^(r|n|b|q|k|p)$/i
  }

  static get ASSOCIATE_PARTS_TO_CHECKER_PART(): {
    [keyname: string]: string | undefined
  } {

    return {
      "pawn": "isValidTimesPawns",
      "king": "isValidTimesKings",
      "queen": "isValidTimesQueens",
      "rook": "isValidTimesRooks",
      "bishop": "isValidTimesBishops",
      "knight": "isValidTimesKnights"
    }

  }

  static get ASSOCIATE_PARTS_TO_SCAN_PART(): AssociatePartsToScanPart {
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
    }
  }

  static normalizePartName( partName: FenCharPosition ): string | null {

    if( /^p$/i.test(partName) ) {

      return "pawn"
    } else if( /^k$/i.test(partName) ) {

      return "king"
    } else if( /^q$/i.test(partName) ) {

      return "queen"
    } else if( /^r$/i.test(partName) ) {

      return "rook"
    } else if( /^n$/i.test(partName) ) {

      return "knight"
    } else if( /^b$/i.test(partName) ) {

      return "bishop"
    }

    return null
  }

  constructor( worker: Worker ) {

    this.worker = worker

    this.position = this.worker.position
    this.options = this.worker.options

    this.initOptions()
    this.initState()
    this.initScan()

    this.checkers()
  }

  checkerRowsSize(): void {

    let isFindIlegalRowSize = false

    const rows: string[] = this.position.split( this.options.separator )

    rows.forEach( (row: string) => {

      let size = 0

      const chars: string[] = row.split('')

      chars.forEach( (char: FenCharPosition) => {

        if( !isNaN(parseInt(char)) ) {
          size += parseInt( char )
        } else {
          size++
        }

      } )

      if( size !== 8 ) {

        isFindIlegalRowSize = true
      }

    } )

    if( isFindIlegalRowSize ) {

      this.state.isValidNumberCharsBetweenDash = false
    }

  }

  checkerParts(): void {

    let countParts = 0
    let countWhiteParts = 0
    let countBlackParts = 0

    this.position.split('').forEach( (char: FenCharPosition) => {

      if( IsValid.PATTERN_PART.test( char ) ) {

        countParts++

        if( char === char.toLocaleUpperCase() ) {

          countWhiteParts++
        }
      }


    } )

    countBlackParts = ( countParts - countWhiteParts )

    if( countParts > 32 || countParts < 2 ) {

      this.state.isValidParts = false
    }
    if( countWhiteParts > 16 || countWhiteParts < 1 ) {

      this.state.isValidPartsByPlayer = false
    }
    if( countBlackParts > 16 || countBlackParts < 1 ) {

      this.state.isValidPartsByPlayer = false
    }

    this.scan.countParts = countParts
    this.scan.countWhiteParts = countWhiteParts
    this.scan.countBlackParts = countBlackParts
  }

  checkTimesParts( partName: FenCharPosition, times: number ): void {

    const attributeChecker: string | null = this.getCheckerPartsByPartName( partName )
    const attributesScan: {[keyname: string]: string} | null = this.getScanPartByPartName( partName )

    if( typeof attributeChecker !== "string") {
      return
    }

    let countPartsWhite = 0
    let countPartsBlack = 0

    const chars: string[] = this.position.split('')

    chars.forEach( (char: FenCharPosition) => {

      const partRegex: RegExp = new RegExp(`^${partName}$`, "i")

      if( partRegex.test( char ) ) {

        // is white part
        if( char.toLocaleUpperCase() === char ) {

          countPartsWhite++

        } else {

          countPartsBlack++
        }

      }

    } )

    if( countPartsBlack > times || countPartsWhite > times ) {

      this.state[ attributeChecker ] = false
    }

    if( attributesScan ) {
      this.scan[ attributesScan.all ] = ( countPartsWhite + countPartsBlack )
      this.scan[ attributesScan.white ] = countPartsWhite
      this.scan[ attributesScan.black ] = countPartsBlack
    }

  }

  checkKings(): void {

    const isExistsWhiteKing = this.position.indexOf('K') !== -1
    const isExistsBlackKing = this.position.indexOf('k') !== -1

    if( !isExistsWhiteKing || !isExistsBlackKing ) {

      this.state.isExistsKings = false
    }
  }

  checkNumberRows(): void {

    const rows = this.position.split( this.options.separator )

    this.state.isValidNumberRows = rows.length === 8
  }

  checkChars(): void {

    let isFoundIlegalChar = false

    const chars: string[] = this.position.split('')

    const legalChars: string = ("rnbqkpRNBKQP12345678" + this.options.separator);

    chars.forEach( (char: FenCharPosition) => {

      if( legalChars.indexOf( char ) === -1 ) {
        isFoundIlegalChar = true
      }

    } )

    if( isFoundIlegalChar ) {

      this.state.isValidChars = false
    }

  }

  public get result(): FenPositionResponse {

    const response: FenPositionResponse = {
      isValid: this.state.isValid,
      stats: this.state.attributes
    }

    if( this.state.details ) {

      response.details = this.state.details
    }

    if( this.state.warn ) {

      response.warn = this.state.warn
    }

    if( response.isValid ) {

      response.scan = this.scan
    }

    return response
  }

  protected checkers() {

    this.checkNumberRows()
    this.checkChars()
    this.checkKings()

    this.checkTimesParts( ("p" as FenCharPosition), 8 )
    this.checkTimesParts( ("k" as FenCharPosition), 1 )
    this.checkTimesParts( ("r" as FenCharPosition), 10 )
    this.checkTimesParts( ("q" as FenCharPosition), 9 )
    this.checkTimesParts( ("n" as FenCharPosition), 10 )
    this.checkTimesParts( ("b" as FenCharPosition), 10 )

    this.checkerParts()
    this.checkerRowsSize()
  }

  protected initScan(): void {

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
    }

  }

  protected initState(): void {

    const _this = this;

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

      get isValid(): boolean {

        const minimalIsValid = ( this.isValidNumberRows &&
          this.isValidChars &&
          this.isValidTimesPawns &&
          this.isValidTimesKings &&
          this.isValidTimesQueens &&
          this.isValidTimesRooks &&
          this.isValidTimesBishops &&
          this.isValidTimesKnights &&
          this.isValidNumberCharsBetweenDash &&
          this.isValidParts &&
          this.isValidPartsByPlayer )

        return minimalIsValid && ( _this.options.isRequireKings ? this.isExistsKings: true )

      },

      get details(): string[] | null {

        const details = []

        if( this.isValid ) {
          return null
        } else if( !this.isValidNumberRows ) {

          details.push( "should contains 8 rows" )
        } else if( !this.isValidChars ) {

          details.push( "contains invalid characters" )
        } else if( !this.isExistsKings ) {

          details.push( "kings missing ilegal position" )
        } else if( !this.isValidTimesPawns ) {

          details.push( "number pawns is invalid ilegal position" )
        } else if( !this.isValidTimesKings ) {

          details.push( "number kings is invalid ilegal position" )
        } else if( !this.isValidTimesQueens ) {

          details.push( "number queens is invalid ilegal position" )
        } else if( !this.isValidTimesRooks ) {

          details.push( "number rooks is invalid ilegal position" )
        } else if( !this.isValidTimesBishops ) {

          details.push( "number bishops is invalid ilegal position" )
        } else if( !this.isValidTimesKnights ) {

          details.push( "number knights is invalid ilegal position" )
        }

        return details
      },

      get warn(): string | null {

        if( !this.isValidNumberRows || !this.isValidNumberCharsBetweenDash ) {

          return "verify if row separator is really dash (/)"
        } else if( !this.isValidChars ) {

          return "verify if contains white space inside FEN position"
        }

        return null
      },

      get attributes(): StateAttributes {

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
        }
      }
    }

  }

  protected initOptions(): void {

    this.options = this.options || {}

    const options = {
      isRequireKings: this.options.isRequireKings || true,
      separator: this.options.separator || "/"
    }

    this.options = options
  }

  protected getCheckerPartsByPartName( partName: FenCharPosition ): string | null {

    const partNormalize: string = IsValid.normalizePartName( partName )

    if( !partNormalize ) {

      return null
    }

    if( partNormalize in IsValid.ASSOCIATE_PARTS_TO_CHECKER_PART ) {

      return IsValid.ASSOCIATE_PARTS_TO_CHECKER_PART[ partNormalize ]
    }

    return null
  }

  protected getScanPartByPartName( partName: FenCharPosition ): {[keyname: string]: string} | null {

    const partNormalize: string | null = IsValid.normalizePartName( partName )

    if( !partNormalize ) {

      return null
    }

    if( partNormalize in IsValid.ASSOCIATE_PARTS_TO_SCAN_PART ) {

      return IsValid.ASSOCIATE_PARTS_TO_SCAN_PART[ partNormalize ]
    }

    return null
  }

}

export = IsValid;
