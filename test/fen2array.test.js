const {expect, assert} = require('chai');

const fen2array = require('./../src/fen-converter/fen2array/fen2array.js')
const factory = require('./factory/fen2array.json')

describe('module fen2array', () => {

  it('should be a function', () => {

    assert.isFunction( fen2array )

  } )

  describe('return value', () => {

    factory.calls.forEach( call => {

      const response = fen2array( call.entry );

      const message = `should be exactly: ${call.output.join(',').slice(0,6) + "..."}`

      it( message, () => {

        expect( call.output ).to.deep.equal( response )
      } )

    } );

  } )

} );
