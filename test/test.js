
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

	it( 'should provide a method to get the initial accumulator value', function test() {
		var stream = rStream();
		expect( stream.value ).to.be.a( 'function' );
	});

	it( 'should provide a method to set the initial accumulator value', function test() {
		var stream = rStream();
		stream.value( 5 );
		assert.strictEqual( stream.value(), 5 );
	});

	it( 'should not allow a non-numeric initial accumulator value', function test() {
		var stream = rStream();
		
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );
		expect( badValue( function() {} ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				stream.value( value );
			};
		}
	});

	it( 'should provide a method to get the reduce function', function test() {
		var stream = rStream();
		expect( stream.reduce ).to.be.a( 'function' );
	});

	it( 'should provide a method to set the reduce function', function test() {
		var stream = rStream();
		stream.value( 5 );
		assert.strictEqual( stream.value(), 5 );
	});

	it( 'should not allow the reducer to be set to anything other than a function', function test() {
		var stream = rStream();
		
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( 5 ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				stream.reduce( value );
			};
		}
	});

	it( 'should throw an error if a reduce function or an accumulator are not provided', function test() {
		var stream = rStream();

		expect( stream.stream ).to.throw( Error );

		stream.value( 0 );
		expect( stream.stream ).to.throw( Error );

		stream = rStream();
		stream.reduce( function ( acc, d ) {
			return acc + 1;
		});
		expect( stream.stream ).to.throw( Error );
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
		stream = rStream()
			.reduce( reduce )
			.value( 0 )
			.stream();

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
		stream = rStream()
			.reduce( reduce )
			.value( 1 )
			.stream();

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