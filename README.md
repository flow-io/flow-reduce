flow-reduce
==========

Through stream which performs a reduction.


## Installation

``` bash
$ npm install flow-reduce
```


## Examples

``` javascript
var // Flow reduce stream generator:
	rStream = require( 'flow-reduce' );

var data = new Array( 1000 ),
	stream;

// Create some data...
for ( var i = 0; i < 1000; i++ ) {
	data[ i ] = Math.random();
}

// Create a new stream (counter):
stream = rStream()
	.reduce( function( acc, d ){
		return acc+1;
	})
	.acc( 0 )
	.stream();

// Add a listener:
stream.on( 'data', function( data ) {
	console.log( data );
});

// Write the data to the stream:
for ( var j = 0; j < data.length; j++ ) {
	stream.write( data[ j ] );
}
stream.end();
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

