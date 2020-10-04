import {FenReaderInterface, FenReaderPosition, ScanResponse} from './fen-reader-head'
import {FenPosition, FenPositionResponse} from './../is-valid-fen-position/is-valid-fen-position-head'
import {FenComposition} from './../composition'

import array2fen from './../fen-converter/array2fen/array2fen'
import fen2array from './../fen-converter/fen2array/fen2array'
import json2array from './../fen-converter/json2array/json2array'
import fen2json from './../fen-converter/fen2json/fen2json'
import json2fen from './../fen-converter/json2fen/json2fen'

import normalizer from './../normalizer'

import isValidFenPosition from './../is-valid-fen-position/is-valid-fen-position'

/**
 * @classdesc wrap fen converters and checker/scanner position
 */
class FenReader implements FenReaderInterface {

  public moveTo: string | null;
  public notedMove: string | null;
  public semiMove: number | null;
  public countMoves: number | null;

  protected currentFenPosition: string | null;
  protected isValidFenResponse: FenPositionResponse | null;
  protected castlings: string | null;

  constructor( position?: string ) {

    if( typeof position === "string" ) {

      this.setPosition( position )
    }
  }

  /**
  * @description remove current position save before add new position
  */
  protected clear(): void {

    this.currentFenPosition = null;
    this.moveTo = null;
    this.castlings = null;
    this.semiMove = null;
    this.moveTo = null;
    this.notedMove = null;
    this.isValidFenResponse = null;
  }

  /**
   * @see FenReaderInterface
   */
  public setPosition( position: string | Array<string[]> | {[keyname: string]: string} ): boolean {

    this.clear()

    if( typeof position === "string" ) {

      this.currentFenPosition = position

    } else if( position instanceof Array ) {

      this.currentFenPosition = array2fen( position )

    } else if( typeof position === "object"  ) {

      this.currentFenPosition = json2fen( position )

    } else {

      throw new TypeError('arg1: position, should be: string | Array<string[]> | {[keyname: string]: string}')
    }

    const fenPositionNormalized: FenComposition = normalizer( this.currentFenPosition )

    this.currentFenPosition = fenPositionNormalized[0]

    this.moveTo = fenPositionNormalized[1]
    this.castlings = fenPositionNormalized[2]
    this.notedMove = fenPositionNormalized[3]
    this.semiMove = fenPositionNormalized[4] !== null ? parseInt(fenPositionNormalized[4]): null
    this.countMoves = fenPositionNormalized[5] !== null ? parseInt(fenPositionNormalized[5]): null

    this.isValidFenResponse = isValidFenPosition( {
      position: (this.currentFenPosition as FenPosition)
    } )

    return this.isValidFenResponse.isValid
  }

  get whiteCastling(): string | null {

    if( this.castlings === null ) {
      return null
    } else if( this.castlings === "-" ) {
      return "-"
    } else {

      if( this.castlings.indexOf('KQ') !== -1 ) {

        return "KQ"
      } else {
        return "-"
      }
    }
  }

  get blackCastling(): string | null {

    if( this.castlings === null ) {
      return null
    } else if( this.castlings === "-" ) {
      return "-"
    } else {

      if( this.castlings.indexOf('kq') !== -1 ) {

        return "kq"
      } else {

        return "-"
      }

    }
  }

  get scan(): ScanResponse | null {

    return typeof this.isValidFenResponse.scan !== "undefined" ? this.isValidFenResponse.scan: null
  }

  get position(): FenReaderPosition {

    const _this = this;

    return {

      get fen(): string | null {

        return _this.currentFenPosition
      },

      get array(): Array<string[]> | null {

        return typeof _this.currentFenPosition === "string" ? fen2array( _this.currentFenPosition ): null
      },

      get json(): {[keyname: string]: string} | null {

        return typeof _this.currentFenPosition === "string" ? fen2json( _this.currentFenPosition ): null
      }

    };

  }

}

const converters = {
  array2fen,
  fen2array,
  json2array,
  fen2json,
  json2fen,
  array2json: function( arrayFen: Array<string[]> ): {
    [keyname: string]: string
  } {

    return fen2json( array2fen( arrayFen ) )
  }
}

const createFenReader = (position?: string): FenReaderInterface => {

  return new FenReader( position )
}

export {
  createFenReader,
  converters,
  isValidFenPosition,
  normalizer
}
