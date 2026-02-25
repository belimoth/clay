wui.canvas = function( el, w, h, s = 2 ) {
	if ( el == null ) {
		var div = document.createElement( "div" );
		div.classList.add( "canvas" );
		el = document.createElement( "canvas" );
		div.appendChild( el );

		// TODO do this after setting attributes

		wui.view.appendChild( div );
	} else {
		if ( w == null && el.width  ) { w = el.width;  }
		if ( h == null && el.height ) { h = el.height; }
	}
	
	this.el = el;
	this.w = w;
	this.h = h;

	// TODO don't need to set these if we got them from the element

	el.width  = w;
	el.height = h;

	// TODO check for calculated style.width

	// TODO just detect desnsity like before

	el.style.width  = w / s + "px";
	el.style.height = h / s + "px";
};

wui.canvas.prototype.initializeContext = function() {
	var context = this.el.getContext( "2d" );

	context.imageSmoothingEnabled       = false;
	context.msImageSmoothingEnabled     = false;
	context.mozImageSmoothingEnabled    = false;
	context.webkitImageSmoothingEnabled = false;

	return context;
};

wui.canvas.prototype.draw = function( f ) {
	var context = this.initializeContext();
	var image   = context.createImageData( this.w, this.h );
	var data    = image.data;

	f( data );

	context.putImageData( image, 0, 0 );
};