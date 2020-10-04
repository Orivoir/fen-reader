import fen2array from '../fen2array/fen2array'

type FenJson = {
  [keyname: string]: string
}

interface Fen2JsonOptions {

  isRemoveEmptySquare: boolean, // [=true]
  isImplicitColor: boolean, // [=false]
  emptySquare: any

}

// resolve default values
function getOptions( options: Fen2JsonOptions ): Fen2JsonOptions {

  if( typeof options !== "object" ) {
    options = {
      isRemoveEmptySquare: true,
      isImplicitColor: false,
      emptySquare: ""
    }

  } else {

    if( typeof options.isRemoveEmptySquare !== "boolean" ) {

      options.isRemoveEmptySquare = true
    }

    if( typeof options.isImplicitColor !== "boolean" ) {

      options.isImplicitColor = false
    }

    if( typeof options.emptySquare === "undefined" ) {

      options.emptySquare = ""
    }
  }

  return options;
}

function getColor( square: string ): string {

  if( square === square.toLocaleUpperCase() ) {
    return "w"
  }

  return "b"
}

function key2coo( col: number, row: number ): string {

  let colsLetters: string = "abcdefgh"

  row += 1
  row = 8 - row + ( 1 )

  const colLetter = colsLetters[ col ]

  return `${colLetter}${row.toString()}`
}

function fen2json( fen: string, options?: Fen2JsonOptions ): FenJson {

  options = getOptions( options )

  const fenArray: Array<string[]> = fen2array( fen )

  const fenJson: FenJson = {}

  fenArray.forEach( (row: string[], keyRow: number): void => {

    row.forEach( (square: string, keySquare: number) => {

      const coo = key2coo( keySquare, keyRow )

      if( square.length ) {

        if( !options.isImplicitColor ) {

          fenJson[ coo ] = (square.toLocaleLowerCase()) + getColor( square )
        } else {

          // letter case depending color part ( lower = black, upper = white )
          fenJson[ coo ] = square
        }
      } else if( !options.isRemoveEmptySquare ) {

        fenJson[ coo ] = options.emptySquare;
      }

    } )

  } )

  return fenJson
}

export = fen2json
