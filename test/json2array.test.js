const {expect, assert} = require('chai');
const factory = require('./factory/json2array.json');

const json2array = require('./../src/fen-converter/json2array/json2array.js');

describe('module json2array', () => {

  describe('return value', () => {

    factory.calls.forEach( call => {

      const response = json2array( call.entry )

      it('should be valid output', () => {

        expect( response ).to.deep.equal( call.output )

      } )

    } );

  } );

} );
