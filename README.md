flow-reduce
==========

Through stream which performs a reduction.


## Installation

``` bash
$ npm install flow-reduce
```


## Examples

``` javascript
var eventStream = require( 'event-stream' ),
	rStream = require( 'flow-reduce' );

// Create some data...
var data = new Array( 1000 );
for ( var i = 0; i < 1000; i++ ) {
	data[ i ] = Math.random();
}

// Create a readable stream:
var readStream = eventStream.readArray( data );

// Create a new stream (counter):
var stream = rStream()
	.reduce( function( acc, d ){
		return acc+1;
	})
	.acc( 0 )
	.stream();

// Pipe the data:
readStream.pipe( stream )
	.pipe( process.stdout );
```

## Tests

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions.

Assuming you have installed Mocha, execute the following command in the top-level application directory to run the tests:

``` bash
$ mocha
```

All new feature development should have corresponding unit tests to validate correct functionality.


## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.

