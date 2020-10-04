import {ScanResponse} from './../is-valid-fen-position/is-valid-fen-position-head'

interface FenReaderPosition {
  // not null while one position is define

  readonly fen: string | null,
  readonly array: Array<string[]> | null,
  readonly json: {[keyname: string]: string} | null
}

interface FenReaderInterface {

  /**
   * @param position string | Array<string[]> | {[keyname: string]: string}
   * @description change current fen position from multiple format recognize by fen converters
   */
  setPosition( position: string | Array<string[]> | {[keyname: string]: string} ): boolean,

  readonly position: FenReaderPosition,

  // not null while one position is define
  readonly scan: ScanResponse | null,

  readonly whiteCastling: string | null,
  readonly blackCastling: string | null,
}

export {
  FenReaderInterface,
  FenReaderPosition,
  ScanResponse
}
