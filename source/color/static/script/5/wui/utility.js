function clamp( x, min, max ) {
	x = Math.max( x, min );
	x = Math.min( x, max );
	return x;
}

function wait_frame( callback ) {
	window.requestAnimationFrame( function( time ) { window.requestAnimationFrame( callback ); });
}