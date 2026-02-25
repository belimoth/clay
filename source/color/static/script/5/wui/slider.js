wui.slider = function ( swatch, el, f = null, stops = [ 0, 1 ], include_gradient_x = false ) {
	this.swatch = swatch;
	swatch.sliders.push( this );

	if ( el == null ) {
		el = document.createElement( "div" )
		el.classList.add( "slider" );

		// schedule this after initial style manipulation maybe

		wui.view.appendChild( el )
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

		// TODO rename this to "no gradient" or something

		if ( ! include_gradient_x ) {
			var gradient = "linear-gradient( 90deg, " + this.stops.map( function ( el ) {
				var out = data_to_hex( f( swatch.rgb, el * 255, true ) );
				if ( include_gradient_x ) { out += " " + ( el * 255 ) + "px"; }
				return out;
			}).join( ", " ) + " )";

			this.el.style.background = gradient;
		}

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