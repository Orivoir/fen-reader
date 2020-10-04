import {FenComposition} from './composition';

function normalizer( fen: string ): FenComposition {

  if( typeof fen !== "string" ) {

    throw new TypeError("arg1: fen, should be a string value");
  } else if( !fen.length ) {

    throw new RangeError("arg1: fen, is not a valid fen position");
  }

  const fenElements: string[] = fen.split(' ');

  if( fenElements.length < 6 ) {

    while( fenElements.length < 6 ) {
      fenElements.push( null );
    }

  } else if( fenElements.length > 6 ) {

    const compose = (fenElements.slice( 0, 6 ) as FenComposition);

    return compose;
  }

  return (fenElements as FenComposition);
}

export = normalizer;
