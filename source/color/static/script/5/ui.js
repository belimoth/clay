// document.addEventListener( "DOMContentLoaded", function() {

window.addEventListener( "load", function() {
	var swatch = new wui.swatch( document.getElementById( "swatch-0" ) );

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

	const denominator = 12;

	var primaries = new wui.slider( swatch, document.getElementById( "primaries" ), function( rgb, x, signal ) {
		var hsl = swatch.hsl;
		var d = denominator;

		if ( x == null ) {
			// return - 256;

			x = Math.round( hsl.h * d ) / d;
			x =( x * 256 ) % 256 ;
			return x;
		}

		x = x / 256;
		x = Math.floor( x * d ) / d;
		
		return hsl_to_rgb( x, 1.0, 0.5 );
	}, null, true );
	
	primaries.el.style.imageRendering = "pixelated";
	primaries.el.style.backgroundSize = "100%";
	primaries.el.style.backgroundImage = "url(" + createRainbow() + ")";
	primaries.thumb_el.style.marginLeft = "3px";

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

	wui.view = document.getElementById( "view-hsl" );

	var hsl_h_xPrevious, hsl_s_xPrevious;

	var hue = new wui.slider( swatch, null, function( rgb, x ) {
		var hsl = swatch.hsl;

		if ( x == null ) {
			x = hsl.h * 256;

			if ( hsl.l == 1 || hsl.l == 0 || hsl.s == 0 ) {
				return hsl_h_xPrevious;
			}

			hsl_h_xPrevious = x;

			return x;
		}

		return {
			rgb : hsl_to_rgb( x / 256, hsl.s, hsl.l )
		};
	}, [ 0, 1/6, 2/6, 3/6, 4/6, 5/6, 1 ] );

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

	const segment_count = 6;
	const segment_width = 2;

	var segment = new wui.slider( swatch, null, function( rgb, x, sensor = false ) {
		var hsl = swatch.hsl;

		var d = segment_count;
		var min = Math.floor( hsl.h * d ) / d;

		if ( x == null ) {
			x = Math.floor( min * 256 );

			if ( x != xPrevious && slide ) {
				var css_class = "slide-right";
				if ( x < xPrevious ) { css_class = "slide-left"; }

				segment.thumb_el.classList.add( css_class );

				wait_frame( function() {
					segment.thumb_el.classList.remove( css_class );
				});		
			}

			xPrevious = x;
			return x;
		}

		min = Math.floor( x / 255 * d ) / d;
		var max = min + segment_width / 2 / d;

		if ( sensor ) {
			return hsl_to_rgb( min, hsl.s, hsl.l );
		}

		return hue_window( rgb, detail.x, min, max );
	}, [ 0, 1/6, 2/6, 3/6, 4/6, 5/6, 1 ] );

	var xPrevious = 0;
	var slide = false;

	segment.onCapture = function() {
		slide = true;
	};

	segment.onRelease = function() {
		slide = false;
	};

	segment.thumb_el.style.marginLeft = "-1px";
	segment.thumb_el.style.width = Math.round( segment_width * 256 / 2 / segment_count + 4 ) + "px";

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

	function hue_window( rgb, x, min, max ) {
		var hsl = swatch.hsl;

		if ( x == null ) {
			x = ( hsl.h - min ) * 256 / ( max - min );
			return Math.round( x );
		}

		var t = Math.min( x, 255 ) / 256;

		return hsl_to_rgb( ( 1 - t ) * min + t * max, hsl.s, hsl.l )
	}

	var detail = new wui.slider( swatch, null, function( rgb, x ) {
		var hsl = swatch.hsl;
		var d = segment_count;
		var min = Math.floor( hsl.h * d ) / d;
		var max = min + segment_width / 2 / d;
		return hue_window( rgb, x, min, max );
	});

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

	new wui.slider( swatch, null, function( rgb, x ) {
		var hsl = swatch.hsl;

		if ( x == null ) {
			return hsl.l * 255;
		}

		return {
			rgb : hsl_to_rgb( hsl.h, hsl.s, x / 255 )
		};
	}, [ 0, 1/2, 1 ] );

	new wui.slider( swatch, null, function( rgb, x ) {
		var hsl = swatch.hsl;

		if ( x == null ) {
			x = hsl.s * 255;

			if ( hsl.l == 1 || hsl.l == 0 ) {
				return hsl_s_xPrevious;
			}

			hsl_s_xPrevious = x;
			return x;
		}

		return hsl_to_rgb( hsl.h, x / 255, hsl.l );
	});

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

	wui.view = document.getElementById( "view-hsluv" );

	new wui.slider( swatch, null, function( rgb, x ) {
		var luv = hsluv.rgbToHsluv([ rgb.r / 255, rgb.g / 255, rgb.b / 255 ]);

		if ( x == null ) {
			return luv[0] * 255 / 360;
		}

		luv[0] = x % 360 * 360 / 255;
		rgb = hsluv.hsluvToRgb([ luv[0], luv[1], luv[2] ]);

		return {
			r : Math.round( rgb[0] * 255 ),
			g : Math.round( rgb[1] * 255 ),
			b : Math.round( rgb[2] * 255 ),
		}
	}, Array(255).fill(0).map( ( el, i ) => i / 255 ) );

	new wui.slider( swatch, null, function( rgb, x ) {
		var luv = hsluv.rgbToHsluv([ rgb.r / 255, rgb.g / 255, rgb.b / 255 ]);

		if ( x == null ) {
			return luv[1] * 255 / 100;
		}

		luv[1] = x * 100 / 255;
		rgb = hsluv.hsluvToRgb([ luv[0], luv[1], luv[2] ]);

		return {
			r : Math.round( rgb[0] * 255 ),
			g : Math.round( rgb[1] * 255 ),
			b : Math.round( rgb[2] * 255 ),
		}
	}, Array(255).fill(0).map( ( el, i ) => i / 255 ) );

	new wui.slider( swatch, null, function( rgb, x ) {
		var luv = hsluv.rgbToHsluv([ rgb.r / 255, rgb.g / 255, rgb.b / 255 ]);

		if ( x == null ) {
			return luv[2] * 255 / 100;
		}

		luv[2] = x * 100 / 255;
		rgb = hsluv.hsluvToRgb([ luv[0], luv[1], luv[2] ]);

		return {
			r : Math.round( rgb[0] * 255 ),
			g : Math.round( rgb[1] * 255 ),
			b : Math.round( rgb[2] * 255 ),
		}
	}, Array(255).fill(0).map( ( el, i ) => i / 255 ) );

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

	wui.view = document.getElementById( "view-rgb" );

	new wui.slider( swatch, null, function( rgb, x ) {
		if ( x == null ) {
			return rgb.r;
		}

		return {
			r : x,
			g : rgb.g,
			b : rgb.b,
		};
	});

	new wui.slider( swatch, null, function( rgb, x ) {
		if ( x == null ) {
			return rgb.g;
		}

		return {
			r : rgb.r,
			g : x,
			b : rgb.b,
		};
	});

	new wui.slider( swatch, null, function( rgb, x ) {
		if ( x == null ) {
			return rgb.b;
		}

		return {
			r : rgb.r,
			g : rgb.g,
			b : x,
		};
	});

	swatch.set( hexToRgb( "33AAFF" ) );
});