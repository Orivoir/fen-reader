const {expect, assert} = require('chai');
const json2fen = require('./../src/fen-converter/json2fen/json2fen.js');
const factory = require('./factory/json2fen.json');

describe('module json2fen', () => {

  describe('return value', () => {

    factory.calls.forEach( call => {

      const response = json2fen( call.entry );

      it( 'should be valid return', () => {

        expect( response ).to.equal( call.output );

      } );

    } );

  } );

} );
