const {expect, assert} = require('chai');

const normalizer = require('./../src/normalizer.js');

const factory = require('./factory/normalize.json');

const THROW_ASSOCIATE = {
  "RangeError": RangeError,
  "TypeError": TypeError
};

describe('module normalizer', () => {

  it('should be a function lenght 1', () => {

    assert.isFunction( normalizer );

    // Function.length return number parameters define from function header
    expect( normalizer ).to.have.lengthOf( 1 );

  } );

  describe('return value', () => {

    factory.calls.forEach(call => {

      const response = normalizer( call.entry );

      it('should return a array length 6', () => {

        assert.isArray( response );

        expect( response ).to.have.lengthOf( 6 );

      } );

      const message = `should exactly return: "${response.join(',')}"`;

      it( message, () => {

        expect( call.output ).to.deep.equal( response );

      } );

    });

  } );

  describe('throws', () => {

    factory.throws.forEach( _throw => {

      const message = `should throw: ${_throw.name}`;

      it( message, () => {

        const fxThrow = () => normalizer( _throw.entry );

        if( !THROW_ASSOCIATE[ _throw.name ] ) {

          throw "throw type not found";
        }

        expect( fxThrow ).to.throw( THROW_ASSOCIATE[ _throw.name ], _throw.message );

      } );

    } );

  } );

} );
