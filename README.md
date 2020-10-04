# [fen-reader](https://npmjs/package/fen-reader)

chess [FEN](https://fr.wikipedia.org/wiki/Notation_Forsyth-Edwards) **reader**,
**converters**, **scanner** and **check** position validity.

- [installation](#installation)
- [converters](#converters)
  - [fen2array](#fen2array)
  - [fen2json](#fen2json)
  - [reciprocal](#reciprocal)
- [validity](#validity)
- [normalizer](#normalizer)
- [createFenReader](#createFenReader)

## installation

```bash
> npm install --save fen-reader
```

or with yarn

```bash
> yarn add fen-reader
```

## converters

Converters can transform **FEN** position format:

- string to array `fen2array(fen: string): Array<string[]>`
- string to json `fen2json(fen: string): {[keyname: string]: string}`
- array to json `array2json(fen: Array<string[]>): {[keyname: string]: string}`
- array to string `array2fen(fen: Array<string[]>): string`
- json to array `json2array(fen: {[keyname: string]: string}): Array<string[]>`
- json to string `json2fen(fen: {[keyname: string]: string}): string`

for extract **FEN** position of full **FEN** format see [normalizer](#normalizer)

*e.g* FEN position: `rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR`
*e.g* full FEN: `rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2`

### fen2array

```js

const {converters} = require('fen-reader');

const fenArray = converters.fen2array('rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR');

console.log(fenArray);
/*
[
  ["r","n","b","q","k","b","","r"],
  ["p","p","p","p","p","p","p","p"],
  ["","","","","","n","",""],
  ["","","","","","","",""],
  ["","","","","P","","",""],
  ["","","","","","","",""],
  ["P","P","P","P","","P","P","P"],
  ["R","N","B","Q","K","B","N","R"]
]
*/

```

black parts in lower case and white parts upper case
array fen is readable as look by white player.

### fen2json

```js

const {converters} = require('fen-reader');

const fenJson = converters.fen2json('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');

console.log(fenJson);
/*
{
  "a1": "rw",
  "b1": "nw",
  "c1": "bw",
  "d1": "qw",
  "e1": "kw",
  "f1": "bw",
  "g1": "nw",
  "h1": "rw",
  "a2": "pw",
  "b2": "pw",
  "c2": "pw",
  "d2": "pw",
  "e2": "pw",
  "f2": "pw",
  "g2": "pw",
  "h2": "pw",
  "a8": "rb",
  "b8": "nb",
  "c8": "bb",
  "d8": "qb",
  "e8": "kb",
  "f8": "bb",
  "g8": "nb",
  "h8": "rb",
  "a7": "pb",
  "b7": "pb",
  "c7": "pb",
  "d7": "pb",
  "e7": "pb",
  "f7": "pb",
  "g7": "pb",
  "h7": "pb"
}
*/
```

can use arg2 `options` for configure output **json fen**

```js
interface Fen2JsonOptions {

  /**
   * @describe json output contains only squares with part while true
   * @default true
   */
  isRemoveEmptySquare: boolean,

  /**
   * @describe parts notation use lower/upper as color depending while true
   * @default false
   */

  isImplicitColor: boolean,

  /**
   * @describe value from empty square while `isRemoveEmptySquare` is false
   * @default null
   */
  emptySquare: any

}
```

### reciprocal

The other converters are reciprocal functions from above functions

- array to json `array2json(fen: Array<string[]>): {[keyname: string]: string}`
- array to string `array2fen(fen: Array<string[]>): string`
- json to array `json2array(fen: {[keyname: string]: string}): Array<string[]>`
- json to string `json2fen(fen: {[keyname: string]: string}): string`

## validity

fen-reader implements checker of position validity.
for extract **FEN** position of full **FEN** format see [normalizer](#normalizer).

```js
const {isValidFenPosition} = require('fen-reader');

const FEN_POSITION = "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR";

const fenPositionResponse = isValidFenPosition( {
  position: FEN_POSITION,
  options: {
    isRequireKings: true, // default=true,
    separator: "/", // rows separator default "/"
  }
} )

console.log( fenPositionResponse )

```

The response position have the below sheme:

```js

interface FenPositionResponse {

  isValid: boolean,
  details?: string[],
  warn?: string,

  /**
  * @see StateAttributes
  * @describe contains status of all checkers position
  */
  stats: StateAttributes,

  /**
  * @see ScanResponse
  * @describe contains scan infos of position only if `isValid` is true
  */
  scan?: ScanResponse
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

interface StateAttributes {

  /**
   * @var isValidNumberRows
   * @describe number valid rows should be 8 as traditional chess game
   */
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

```

### normalizer

normalizer transform a **full FEN position** to array **FEN elements**

```js
const {normalizer} = require('fen-reader');

const FEN_POSITION = "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2";

const fenElements = normalizer(FEN_POSITION);

console.log( fenElements );
/*
[
  "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR",
  "w",
  "KQkq",
  "-",
  "1",
  "2"
]
*/

```

if elements missing after position normalizer considerate as `null`


```js
const {normalizer} = require('fen-reader');

const FEN_POSITION = "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq";

const fenElements = normalizer(FEN_POSITION);

console.log( fenElements );
/*
[
  "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR",
  "w",
  "KQkq",
  null,
  null,
  null
]
*/

```

### createFenReader

createFenReader is a wrap of FEN converters/checker/scanner position

`createFenReader(position?: string): FenReaderInterface`

```js
const {createFenReader} = require('fen-reader')

const fenReader = createFenReader()
```

createFenReader return object implement the above `FenReaderInterface`

```js
interface FenReaderInterface {

  /**
   * @param position string | Array<string[]> | {[keyname: string]: string}
   * @description change current fen position from multiple format recognize by fen converters
   */
  setPosition( position: string | Array<string[]> | {[keyname: string]: string} ): boolean,

  readonly position: FenReaderPosition,

  /**
   * @var scan
   * @describe null while not position define
   * @see ScanResponse
   */
  readonly scan: ScanResponse | null,

  // status castlings
  readonly whiteCastling: string | null,
  readonly blackCastling: string | null,
}

interface FenReaderPosition {

  // all attributes null while not position define

  readonly fen: string | null,
  readonly array: Array<string[]> | null,
  readonly json: {[keyname: string]: string} | null
}

```
