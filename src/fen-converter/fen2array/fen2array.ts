type FenArray = Array<string[]>

function fen2array( fen: string ): FenArray {

  let rowChars: string[] = []

  const transform: FenArray = []

  fen.split('/').forEach( (row: string) => {

    row.split('').forEach( (char: string) => {

      if( isNaN( parseInt(char) ) ) {

        rowChars.push( char )
      } else {

        const emptySquares = parseInt( char )

        for( let i = 0; i < emptySquares; i++ ) {
          rowChars.push("")
        }
      }

    } )

    transform.push( rowChars )
    rowChars = []

  } )

  return transform
}

export = fen2array