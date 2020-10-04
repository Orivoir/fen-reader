type FenCharPosition = "r" | "n" | "b" | "q" | "k" | "p" | "R" | "N" | "B" | "K" | "Q" | "P" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "/"

// FenPosition is a string with constraint content chars
type FenPosition = FenCharPosition[] & string

interface State extends StateReader, StateAttributes {
  [keyname: string]: boolean | string[] | string | StateAttributes | null
}

interface StateAttributes {

  isValidNumberRows: boolean,
  isValidChars: boolean,
  isExistsKings: boolean,
  isValidTimesPawns: boolean,
  isValidTimesKings: boolean,
  isValidTimesQueens: boolean,
  isValidTimesRooks: boolean,
  isValidTimesBishops: boolean,
  isValidTimesKnights: boolean,
  isValidNumberCharsBetweenDash: boolean,
  isValidParts: boolean,
  isValidPartsByPlayer: boolean
}

interface StateReader {

  readonly isValid: boolean,
  readonly details: string[] | null,
  readonly warn: string | null,
  readonly attributes: StateAttributes,
}

interface ScanResponse {

  [keyname: string]: number | null,

  countParts: number | null,
  countWhiteParts: number | null,
  countBlackParts: number | null,

  countPawns: number | null,
  countWhitePawns: number | null,
  countBlackPawns: number | null,

  countRooks: number | null,
  countWhiteRooks: number | null,
  countBlackRooks: number | null,

  countBishops: number | null,
  countWhiteBishops: number | null,
  countBlackBishops: number | null,

  countQueens: number | null,
  countWhiteQueens: number | null,
  countBlackQueens: number | null,

  countKnights: number | null,
  countWhiteKnights: number | null,
  countBlackKnights: number | null,
}

interface AssociatePartsToScanPart {
  [keyname: string]: {[keyname: string]: string} | undefined
}

interface FenPositionResponse {

  isValid: boolean,
  details?: string[],
  warn?: string,

  stats: StateAttributes,
  scan?: ScanResponse
}

interface FenPositionOptions {
  isRequireKings?: boolean,
  separator?: string
}

interface Worker {
  position: FenPosition,
  options?: FenPositionOptions
}

export {
  FenPositionResponse,
  ScanResponse,
  FenPositionOptions,
  Worker,
  State,
  StateAttributes,
  StateReader,
  AssociatePartsToScanPart,

  FenPosition,
  FenCharPosition
}
