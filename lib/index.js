/**
*
*	STREAM: reduce
*
*
*	DESCRIPTION:
*		- 
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/05/21: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] through
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var // Through module:
		through = require( 'through' );


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {stream} Stream instance
	*/
	function Stream() {
		this._acc = null;
		this._reduce = null;
		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: value( value )
	*	Setter and getter for initial value from which to begin accumulation. If a value is provided, sets the initial accumulation value. If no value is provided, returns the accumulation value.
	*
	* @param {number} value - initial value
	* @returns {object|number} instance object or initial value
	*/
	Stream.prototype.value = function( value ) {
		if ( !arguments.length ) {
			return this._acc;
		}
		if ( typeof value !== 'number' || value !== value ) {
			throw new Error( 'value()::invalid input argument. Initial accumulator value must be numeric.' );
		}
		this._acc = value;
		return this;
	}; // end METHOD value()

	/**
	* METHOD: reduce( fcn )
	*	Setter and getter for reduce function. If a function is provided, sets the reduce function. If no function is provided, returns the reduce function.
	*
	* @param {function} fcn - function applied to reduce data. Function should take two arguments: [ accumulator, data ]. Function should return the accumulator.
	* @returns {object|function} instance object or reduce function
	*/
	Stream.prototype.reduce = function( fcn ) {
		if ( !arguments.length ) {
			return this._reduce;
		}
		if ( typeof fcn !== 'function' ) {
			throw new Error( 'reduce()::invalid input argument. Input argument must be a function.' );
		}
		this._reduce = fcn;
		return this;
	}; // end METHOD reduce()

	/**
	* METHOD: stream()
	*	Reduces a data stream to a single value.
	*
	* @returns {stream} reduce stream
	*/
	Stream.prototype.stream = function() {
		var accumulator = this._acc,
			fcn = this._reduce;

		if ( !accumulator && accumulator !== 0 ) {
			throw new Error( 'stream()::stream not initialized. Must first set an accumulator.' );
		}
		if ( !fcn ) {
			throw new Error( 'stream()::stream not initialized. Must first set a reduce function.' );
		}
		return through( onData, onEnd );

		// FUNCTIONS //

		/**
		* FUNCTION: onData( data )
		*	Data event handler. Runs the accumulation function.
		*
		* @private
		* @param {*} data - streamed data
		*/
		function onData( data ) {
			accumulator = fcn( accumulator, data );
		} // end FUNCTION onData()

		/**
		* FUNCTION: onEnd()
		*	End event handler. Emits the accumulated value.
		*
		* @private
		*/
		function onEnd() {
			this.emit( 'data', accumulator );
			this.emit( 'end' );
		} // end FUNCTION onEnd()

	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();