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
		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: stream( fcn, accumulator )
	*	Reduces a data stream to a single value.
	*
	* @param {function} fcn - function applied to reduce data. Function should take two arguments: [ accumulator, data ]. Function should return the accumulator.
	* @param {number} accumulator - initial accumulation value
	* @returns {stream} reducer stream
	*/
	Stream.prototype.stream = function( fcn, accumulator ) {
		if ( arguments.length !== 2 ) {
			throw new Error( 'reduce()::insufficient input arguments. Must provide both an accumulator function and an initial value.' );
		}
		if ( typeof fcn !== 'function' ) {
			throw new Error( 'reduce()::invalid input argument. First argument must be a function.' );
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