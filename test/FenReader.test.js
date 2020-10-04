const {assert, expect} = require('chai');
const {createFenReader} = require('./../src/reader/fen-reader.js');
const factory = require('./factory/FenReader.json')

describe('class: FenReader', () => {

  describe('positions:', () => {

    factory.positions.forEach( position => {

      const reader = createFenReader();

      const isValid = reader.setPosition( position.entry );

      const message = `should a ${!position.isValidPosition ? "not": ""} valid position`;

      it(message, () => {

        expect( isValid ).to.be.equal( position.isValidPosition );
      } );

      describe('position infos:', () => {

        ["countMoves", "semiMove", "notedMove", "moveTo", "whiteCastling", "blackCastling"]
        .forEach( positionInfo => {

          const message = `${positionInfo}: ${position.output[positionInfo]}`;

          it( message, () => {

            expect( reader[positionInfo] ).to.equal( position.output[positionInfo] );

          } );

        } );

      } );

      describe('scan info', () => {

        Object.keys( position.output.scan ).forEach( attribute => {

          const message = `should scan: '${attribute}' as '${position.output.scan[attribute]}'`;

          it( message, () => {

            expect( reader.scan[attribute] ).to.be.equal( position.output.scan[attribute] );
          } );

        } );

      } );

      describe('position converters', () => {

        Object.keys(position.output.positions).forEach( positionType => {

          const message = `should valid position convert to: ${positionType}`

          it(message, () => {

            expect( position.output.positions[positionType] ).to.deep.equal( reader.position[ positionType ] );

          } );

        } );

      } );

    } );

  } );

} );
