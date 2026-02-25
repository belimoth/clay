var wui = {};

function createPicnic() {

	// NOTE throway canvas and context instead of new ImageData(), which is flagged as experimental

	var canvas  = document.createElement( "canvas" );

	canvas.width  = 2;
	canvas.height = 2;

	var context = canvas.getContext( "2d" );
	var image   = context.createImageData( 2, 2 );
	var data    = image.data;

	var w = 2;

	var r = 221;
	var g = 221;
	var b = 221;
	var a = 255;

	var x = 1;
	var y = 0;

	var i = ( x + y * w ) * 4;

	var ir = i + 0;
	var ig = i + 1;
	var ib = i + 2;
	var ia = i + 3;

	data[ ir ] = r;
	data[ ig ] = g;
	data[ ib ] = b;
	data[ ia ] = a;

	x = 0;
	y = 1;

	var i = ( x + y * w ) * 4;

	var ir = i + 0;
	var ig = i + 1;
	var ib = i + 2;
	var ia = i + 3;

	data[ ir ] = r;
	data[ ig ] = g;
	data[ ib ] = b;
	data[ ia ] = a;

	context.putImageData( image, 0, 0 );
	return canvas.toDataURL();
}

var picnic = createPicnic();

var picnic_el = document.createElement( "style" );
picnic_el.innerHTML = "canvas { background-image: url(" + picnic + "); }";
document.head.appendChild( picnic_el );

var loading_el = document.getElementById( "loading" );

wui.canvas = function( el = null, w = null, h = null, s = 2 ) {
	if ( el == null ) {
		el = document.createElement( "canvas" );
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
	
	// TODO put this into an injected <style></style>

	// el.style.backgroundImage = "url(" + picnic + ")";
};

wui.canvas.prototype.initializeContext = function() {
	var context = this.el.getContext( "2d" );

	context.imageSmoothingEnabled       = false;
	context.msImageSmoothingEnabled     = false;
	context.mozImageSmoothingEnabled    = false;
	context.webkitImageSmoothingEnabled = false;

	return context;
};

wui.swatch = function( el, rgb = null ) {
	this.el = el;
	this.rgb = {};
	this.hsl = {};
	this.sliders = [];

	var self = this;

	this.set = function( data, source = null ) {
		// dumb
		if ( data.rgb ) {
			this.rgb = data.rgb;
			this.hsl = rgb_to_hsl( this.rgb.r, this.rgb.g, this.rgb.b );
		} else if ( data.hsl ) {
			this.hsl = data.hsl;
			this.rgb = hsl_to_rgb( this.hsl.h, this.hsl.s, this.hsl.l );
		} else {
			this.rgb = data;
			this.hsl = rgb_to_hsl( this.rgb.r, this.rgb.g, this.rgb.b );
		}

		var hex = rgbToHex( this.rgb.r, this.rgb.g, this.rgb.b );

		this.el.style.background = hex;
		this.el.dataset.hex = hex.toUpperCase();

		this.sliders.forEach( function( el, i ) {
			if ( el != source ) { el.update(); }
		});
	};

	if ( rgb != null ) {
		this.set( rgb );
	}
};

var app = {};

function clamp( x, min, max ) {
	x = Math.max( x, min );
	x = Math.min( x, max );
	return x;
}

wui.slider = function ( swatch, el, f = null, stops = [ 0, 1 ], include_gradient_x = false ) {
	this.swatch = swatch;
	swatch.sliders.push( this );

	if ( el == null ) {
		el = document.createElement( "div" )
	}

	if ( f == null ) {
		f = function( rgb, x ) {
			if ( x == null ) {
				return 255 / 2;
			}

			return rgb;
		};
	}

	this.el = el;
	this.f = f;
	this.stops = stops;

	this.x = 0;

	this.thumb_el = document.createElement( "div" );
	this.el.appendChild( this.thumb_el );

	this.update = function() {
		// dumb
		function data_to_hex( data) {
			var rgb, hsl;

			if ( data.rgb ) {
				rgb = data.rgb;
				hsl = rgb_to_hsl( rgb.r, rgb.g, rgb.b );
			} else if ( data.hsl ) {
				hsl = data.hsl;
				rgb = hsl_to_rgb( hsl.h, hsl.s, hsl.l );
			} else {
				rgb = data;
				hsl = rgb_to_hsl( rgb.r, rgb.g, rgb.b );
			}

			return rgbToHex( rgb )
		}

		var gradient = "linear-gradient( 90deg, " + this.stops.map( function ( el ) {
			var out = data_to_hex( f( swatch.rgb, el * 255, true ) );
			if ( include_gradient_x ) { out += " " + ( el * 255 ) + "px"; }
			return out;
		}).join( ", " ) + " )";

		this.el.style.background = gradient;

		this.x = f( swatch.rgb );
		this.thumb_el.style.left = this.x + "px";
	};

	this.handle = function( x ) {
		this.x = clamp( x, 0, 255 );
		swatch.set( f( swatch.rgb, this.x ) );
	};

	var self = this;

	el.addEventListener( "mousedown", function( event ) {
		app.capture = self;
		if ( self.onCapture ) { self.onCapture(); }
		handle( event );
	});
};

function handle( event ) {
	var x = event.clientX - app.capture.el.getBoundingClientRect().left;
	var y = event.clientY - app.capture.el.getBoundingClientRect().top;
	app.capture.handle( x, y );
};

document.addEventListener( "mousemove", function( event ) {
	if ( app.capture ) {
		handle( event );
	}
});

document.addEventListener( "mouseup", function( event ) {
	if ( app.capture && app.capture.onRelease ) { app.capture.onRelease(); }
	app.capture = null;
});

wui.gradient = function( el ) {
	this.el = el;
	this.canvas = new wui.canvas( null, 512, 64, 1 );

	var div_el = document.createElement( "div" );

	el.appendChild( this.canvas.el );
	el.appendChild( div_el );

	function gradient_item () {
		this.el = document.createElement( "div" );
	}
};

function wait_frame( callback ) {
	window.requestAnimationFrame( function( time ) { window.requestAnimationFrame( callback ); });
}