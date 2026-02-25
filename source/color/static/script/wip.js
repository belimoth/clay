"use strict";

window.addEventListener( "load", function() {
	w = clay.global.w = 512;
	h = clay.global.h = 75 * 2 + 3;

	new wui.canvas( null, w, h, 1 ).draw( function( data ) {
		xyTO__( data, ( x, y ) => hsl_to_rgb( x / w, 1.0, 1 - y / h ) );
	});

	// new wui.canvas( null, w, h, 1 ).draw( function( data ) {
	// 	xyTO__( data, function( x, y ) {
	// 		var rgb = hsl_to_rgb( x / w, 1.0, 0.5 );

	// 		var t = 1 - y / h;

	// 		t = t * 2;

	// 		if ( t > 1 ) {
	// 			t = 2 - t;

	// 			return {
	// 				r : ( 1 - t ) * 255 + rgb.r * t,
	// 				g : ( 1 - t ) * 255 + rgb.g * t,
	// 				b : ( 1 - t ) * 255 + rgb.b * t,
	// 			}
	// 		}

	// 		rgb = {
	// 			r : rgb.r * t,
	// 			g : rgb.g * t,
	// 			b : rgb.b * t,
	// 		}

	// 		return rgb;
	// 	});
	// });

	new wui.canvas( null, w, h, 1 ).draw( function( data ) {
		xyTO__( data, function( x, y ) {
			var rgb = hsluv.hpluvToRgb([ x * 360 / w, 100, ( 1 - y / h ) * 100 ])

			return {
				r : rgb[0] * 255,
				g : rgb[1] * 255,
				b : rgb[2] * 255,
			};
		});
	});

	new wui.canvas( null, w, h, 1 ).draw( function( data ) {
		xyTO__( data, function( x, y ) {
			var rgb = hsluv.hpluvToRgb([ x * 360 / w, 100, 50 ])

			return {
				r : rgb[0] * 255,
				g : rgb[1] * 255,
				b : rgb[2] * 255,
			};
		});
	});

	new wui.canvas( null, w, h, 1 ).draw( function( data ) {
		xyTO__( data, function( x, y ) {
			var rgb = hsluv.hpluvToRgb([ x * 360 / w, 100, 50 ])

			var hsl = rgb_to_hsl(
				rgb[0] * 255,
				rgb[1] * 255,
				rgb[2] * 255,
			);

			var rgb = hsl_to_rgb( hsl.h, 1.0, 1 - y / h );

			return rgb;
		});
	});

	new wui.canvas( null, w, h, 1 ).draw( function( data ) {
		xyTO__( data, function( x, y ) {
			var rgb = hsl_to_rgb( x / w, 1.0, 0.5 );
			var luv = hsluv.rgbToHsluv([ rgb.r / 255, rgb.g / 255, rgb.b / 255 ]);

			rgb = hsluv.hsluvToRgb([ luv[0], luv[1], ( 1 - y / h ) * 100 ])

			// var hsl = rgb_to_hsl(
			// 	rgb[0] * 255,
			// 	rgb[1] * 255,
			// 	rgb[2] * 255,
			// );

			return {
				r : rgb[0] * 255,
				g : rgb[1] * 255,
				b : rgb[2] * 255,
			};

			// var rgb = hsl_to_rgb( hsl.h, 1.0, 1 - y / h );

			return rgb;
		});
	});
});
