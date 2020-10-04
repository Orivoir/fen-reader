const {expect, assert} = require('chai');

const isValidFenPosition = require('./../src/is-valid-fen-position/is-valid-fen-position.js');
const IsValid = require('./../src/is-valid-fen-position/is-valid-fen-position.js');

const factory = require('./factory/is-valid-fen-position.json');

describe('class: IsValid', () => {

  it('should be a function', () => {

    assert.isFunction(IsValid);

  } );

  describe('return value', () => {

    factory.calls.forEach( call => {

      const response = isValidFenPosition( call.entry );

      const message = `should valid position: ${call.output.isValid}`;

      it( message, () => {

        expect( response.isValid ).to.be.equal( call.output.isValid )

      } );

      if( call.output.scan ) {

        const scan = response.scan;

        Object.keys( call.output.scan ).forEach( attribute => {

          const message = `should ${attribute} equal to ${call.output.scan[attribute]}`

          it( message, () => {

            expect( call.output.scan[attribute] ).to.equal( scan[ attribute ] );
          } )

        } );

      }

      if( call.output.stats ) {

        const stats = response.stats;

        Object.keys( call.output.stats ).forEach( attribute => {

          const message = `should ${attribute} is ${call.output.stats[attribute]}`

          it( message, () => {

            expect( call.output.stats[attribute] ).to.equal( stats[ attribute ] );
          } )

        } );
      }

    } );

  } );

} );
