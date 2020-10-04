function array2fen(fenArray: Array<string[]>, separatorRow: string= "/"): string {

  let fen = "";

  fenArray.forEach( (row: string[]) => {

    let countempty: number = 0;

    row.forEach( (char: string) => {

      if( char === "" ) {

        countempty++

      } else {

        if( countempty > 0 ) {

          fen += countempty
          countempty = 0
        }

        fen += char
      }

    } )

    if( countempty > 0 ) {
      fen += countempty
      countempty = 0
    }

    fen += separatorRow

  } )

  // remove last char because is a row separator
  return fen.slice( 0, -1 )
}

export = array2fen