"use strict";

export function canvas_get_context( canvas, opt = null ) {
	opt = Object.assign( { smooth : false, read : false }, opt );

	let context = canvas.getContext( "2d", { willReadFrequently: opt.read });

	if ( ! opt.smooth ) {
		context.mozImageSmoothingEnabled    = false;
		context.webkitImageSmoothingEnabled = false;
		context.msImageSmoothingEnabled     = false;
		context.imageSmoothingEnabled       = false;
	}

	return context;
}

export function canvas_make() {
	let el = document.createElement( "canvas" );
	el.width  = app.file.width;
	el.height = app.file.height;
	return el
}
