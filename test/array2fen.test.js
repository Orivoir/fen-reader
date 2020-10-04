const {assert,expect} = require('chai');
const array2fen = require('./../src/fen-converter/array2fen/array2fen.js');

const factory = require('./factory/array2fen.json');

describe('module array2fen', () => {

  describe('return value', () => {

    factory.calls.forEach( call => {

      const response = array2fen(call.entry);

      const message = `should fen: ${call.output}`;

      it( message, () => {

        expect( response ).to.equal( call.output );

      } );

    } );

  } );

} );
