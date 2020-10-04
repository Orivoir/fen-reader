function generateSquares(): string[] {

  const squares: string[] = []

  for( let col = 8; col > 0; col-- ) {

    for( let row = 7; row >= 0; row-- ) {

      squares.push(
        `${"abcdefgh".charAt(row)}${col}`
      )
    }
  }

  return squares
}

function getNormalizePartName(partName: string): string {

  if( partName.length === 1 ) {

    return partName
  } else {

    const color: string = partName.charAt( 1 )

    if( color === "b" ) {
      return (partName.charAt(0)).toLocaleLowerCase()
    } else {
      return (partName.charAt(0)).toLocaleUpperCase()
    }
  }
}

function json2array(jsonFen: {
  [keyname:string]: string
}): Array<string[]> {

  const squares: string[] = Object.keys( jsonFen )

  const allSquares: string[] = generateSquares()

  // normalize json fen
  // add empty square
  if( squares.length < 64 ) {

    allSquares.forEach( (square: string) => {

      if( !jsonFen[square] ) {
        // empty square
        jsonFen[square] = ""
      }

    } )
  }

  const arrayFen: Array<string[]> = []

  let rowSize = 0
  let rowArrayFen: string[] = []

  allSquares.forEach( (square: string) => {

    if(
      typeof jsonFen[square] !== "string" ||
      !/^(r|n|b|q|k|p)(b|w)?$/i.test( jsonFen[square] )
    ) {
      // empty square
      rowArrayFen.push( "" )
    } else {

      const partName: string = getNormalizePartName( jsonFen[square] )

      rowArrayFen.push( partName )
    }

    rowSize++

    // check end row
    if( rowSize >= 8 ) {
      rowSize = 0
      arrayFen.push( rowArrayFen.reverse() )
      rowArrayFen = []
    }

  } )

  return arrayFen
}

export = json2array
