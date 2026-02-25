var clay = {};

clay.global = {};

clay.x = {};
clay.xy = {};

function xTO_( data, f ) {
	var champ = {
		r : 0,
		g : 0,
		b : 0,
	}

	var c = Array(clay.global.w).fill(0);

	for ( var x = 0; x < clay.global.w; x += 1 ) {
		var frgb = f( x );

		var { fr, fg, fb } = {
			fr : frgb.r,
			fg : frgb.g,
			fb : frgb.b,
		}

		var { r, g, b } = {
			r : Math.floor( fr ), // NOTE change the function here to get different error results
			g : Math.floor( fg ), // NOTE change the function here to get different error results
			b : Math.floor( fb ), // NOTE change the function here to get different error results
		};

		c[x] = rgbToHex( r, g, b );

		var error = {
			r : Math.abs( fr - r ),
			g : Math.abs( fg - g ),
			b : Math.abs( fb - b ),
		};

		champ = {
			r : Math.max( champ.r, error.r ),
			g : Math.max( champ.g, error.g ),
			b : Math.max( champ.b, error.b ),
		};

	// START remove this to not scale champ

	}

	for ( var x = 0; x < clay.global.w; x += 1 ) {
		var frgb = f( x );

		var { fr, fg, fb } = {
			fr : frgb.r,
			fg : frgb.g,
			fb : frgb.b,
		}

		var { r, g, b } = {
			r : Math.floor( fr ), // NOTE same as above
			g : Math.floor( fg ), // NOTE same as above
			b : Math.floor( fb ), // NOTE same as above
		};

		var error = {
			r : fr - r,
			g : fg - g,
			b : fb - b,
		};

		// NOTE uncomment this to return scaled error

		// if ( true ) {
		// 	r = error.r * 255 / champ.r;
		// 	g = error.g * 255 / champ.g;
		// 	b = error.b * 255 / champ.b;
		// }
	// END remove this to not scale champ
		if ( true ) {
			var hex = rgbToHex( r, g, b );
			r = ( c.filter( el => el == hex ).length - 1 ) * ( clay.global.w - 1 );
			g = 0;
			b = 0;
		}

		var a = 255;

		// TODO rewrite to operate on w x 1 canvas and rescale without telling application

		for ( var y = 0; y < clay.global.h; y += 1 ) {
			var i = ( x + y * clay.global.w ) * 4;

			var ir = i + 0;
			var ig = i + 1;
			var ib = i + 2;
			var ia = i + 3;

			data[ ir ] = r;
			data[ ig ] = g;
			data[ ib ] = b;
			data[ ia ] = a;
		}
	}
}

function xyTO__( data, f ) {
	for ( var y = 0; y < clay.global.h; y += 1 ) {
		for ( var x = 0; x < clay.global.w; x += 1 ) {
			var i = ( x + y * clay.global.w ) * 4;

			var { r, g, b } = f( x, y );
			var a = 255;

			var ir = i + 0;
			var ig = i + 1;
			var ib = i + 2;
			var ia = i + 3;

			data[ ir ] = r;
			data[ ig ] = g;
			data[ ib ] = b;
			data[ ia ] = a;
		}
	}
}

clay.x.r = data => xTO_( data, (x) => ({ r : x }) );

clay.x.h = data => xTO_( data, (x) => hsl_to_rgb( x / clay.global.w, 1.0, 0.5 ) );

// RESULTS divide by 256 not 255 to get x in the right range for hue

clay.xy.rg = data => xyTO__( data, ( x, y ) => ({ r : x * 255 / clay.global.w, g : y * 255 / clay.global.h, b :                       0, }) );
clay.xy.gr = data => xyTO__( data, ( x, y ) => ({ r : y * 255 / clay.global.h, g : x * 255 / clay.global.w, b :                       0, }) );
clay.xy.rb = data => xyTO__( data, ( x, y ) => ({ r : x * 255 / clay.global.w, g :                       0, b : y * 255 / clay.global.h, }) );
clay.xy.br = data => xyTO__( data, ( x, y ) => ({ r : y * 255 / clay.global.h, g :                       0, b : x * 255 / clay.global.w, }) );
clay.xy.gb = data => xyTO__( data, ( x, y ) => ({ r :                       0, g : x * 255 / clay.global.w, b : y * 255 / clay.global.h, }) );
clay.xy.bg = data => xyTO__( data, ( x, y ) => ({ r :                       0, g : y * 255 / clay.global.h, b : x * 255 / clay.global.w, }) );