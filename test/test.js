
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Stream spec:
	spec = require( 'stream-spec' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	rStream = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'reduce', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( rStream ).to.be.a( 'function' );
	});

	it( 'should throw an error if a reduce function and accumulator are not provided', function test() {
		expect( rStream().stream ).to.throw( Error );
		expect( getStream ).to.throw( Error );
		return;

		/**
		* FUNCTION: getStream()
		*	Supplies a single argument to the stream generator.
		*
		* @returns {Stream} reduce stream
		*/
		function getStream() {
			return rStream().stream( function reduce( count, x ) {
				return count + 1;
			});
		} // end FUNCTION getStream()
	});

	it( 'should throw an error if the first argument to the stream method is not a function', function test() {
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( 5 ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( true ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		return;

		/**
		* FUNCTION: badValue( value )
		*	Supplies an invalid argument to the stream generator.
		*
		* @param {*} value - bad value
		* @returns {function} stream generator
		*/
		function badValue( value ) {
			return function() {
				rStream().stream( value, 0 );
			};
		} // end FUNCTION getStream()
	});

	

	it( 'should return a single value', function test() {
		var numData = 1000,
			expected = new Array( numData ),
			stream, s,

			// Return last value:
			reduce = function ( acc, val ) {
				acc = val;
				return acc;
			};

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = Math.random();
		}

		// Create a new reduce stream:
		stream = rStream().stream( reduce, 0 );

		// Create the stream spec:
		s = spec( stream )
			.through();

		// Mock reading from the stream:
		utils.readStream( stream, onRead );

		// Validate the stream when the stream closes:
		stream.on( 'close', s.validate );

		// Mock piping a data to the stream:
		utils.writeStream( expected, stream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			var lastVal = expected[ expected.length-1 ];
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], lastVal );
		} // end FUNCTION onRead()
	});

	it( 'should allow for arbitrary reduce functions', function test() {
		var expected = new Array( 10 ),
			stream,

			// Compute a factorial:
			reduce = function ( acc, val ) {
				acc *= val;
				return acc;
			};

		// Simulate some data...
		for ( var i = 1; i < 11; i++ ) {
			expected[ i-1 ] = i;
		}

		// Create a new reduce stream:
		stream = rStream().stream( reduce, 1 );

		// Mock reading from the stream:
		utils.readStream( stream, onRead );

		// Mock piping a data to the stream:
		utils.writeStream( expected, stream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			var val = 1;
			for ( var i = 0; i < expected.length; i++ ) {
				val = val * expected[ i ];
			}
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], val );
		} // end FUNCTION onRead()
	});

});