const {expect, assert} = require('chai');
const fen2json = require('./../src/fen-converter/fen2json/fen2json.js');
const factory = require('./factory/fen2json.json')

describe('module fen2json', () => {

  describe('return value', () => {

    factory.calls.forEach( call => {

      const response = fen2json( call.entry );

      // console.log( response );
      it( 'should be exactly same object response', () => {

        expect( response ).to.deep.equal( call.output );
      } )

    } );

  } );

} );
