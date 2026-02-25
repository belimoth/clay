var clay = {};

clay.x = {};
clay.xy = {};

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex( rr, gg, bb ) {
	var r, g, b;

	if ( gg == null ) {
		r = rr.r;
		g = rr.g;
		b = rr.b;
	} else {
		r = rr;
		g = gg;
		b = bb;
	}

	r = Math.floor( r );
	g = Math.floor( g );
	b = Math.floor( b );

	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function xTO_( data, f ) {
	var champ = {
		r : 0,
		g : 0,
		b : 0,
	}

	var c = Array(w).fill(0);

	for ( var x = 0; x < w; x += 1 ) {
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

	for ( var x = 0; x < w; x += 1 ) {
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
			r = ( c.filter( el => el == hex ).length - 1 ) * 255;
			g = 0;
			b = 0;
		}

		var a = 255;

		// TODO rewrite to operate on w x 1 canvas and rescale without telling application

		for ( var y = 0; y < h; y += 1 ) {
			var i = ( x + y * w ) * 4;

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
	for ( var y = 0; y < h; y += 1 ) {
		for ( var x = 0; x < w; x += 1 ) {
			var i = ( x + y * w ) * 4;

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

// https://stackoverflow.com/a/9493060

function hsl_to_rgb( h, s, l ) {
	// if ( s == null ) {
	// 	s = h.s;
	// 	l = h.l;

	// 	h = h.h;
	// }

	var r, g, b;

	if ( s == 0 ) {
		r = g = b = l;
	} else {
		function hue_to_rgb( p, q, t ) {
			if ( t < 0   ) t += 1;
			if ( t > 1   ) t -= 1;
			if ( t < 1/6 ) return p + ( q - p ) * 6 * t;
			if ( t < 1/2 ) return q;
			if ( t < 2/3 ) return p + ( q - p ) * ( 2/3 - t ) * 6;
			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;

		r = hue_to_rgb( p, q, h + 1/3 );
		g = hue_to_rgb( p, q, h       );
		b = hue_to_rgb( p, q, h - 1/3 );
	}

	return {
		r : r * 255,
		g : g * 255,
		b : b * 255,
	};
}

function rgb_to_hsl ( r, g, b ){
	// if ( g == null ) {
	// 	g = r.g;
	// 	b = r.b;

	// 	r = r.r;
	// }

	r /= 255, g /= 255, b /= 255;

	var max = Math.max( r, g, b )
	var min = Math.min( r, g, b );

	var h, s, l;
	
	l = ( max + min ) / 2;

	if ( max == min ) {
	    h = s = 0;
	} else {
	    var d = max - min;
	    s = l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );

	    switch(max){
	        case r: h = ( g - b ) / d + ( g < b ? 6 : 0 ); break;
	        case g: h = ( b - r ) / d + 2; break;
	        case b: h = ( r - g ) / d + 4; break;
	    }

	    h /= 6;
	}

	return {
		h : h,
		s : s,
		l : l,
	};
}

clay.x.r = data => xTO_( data, (x) => ({ r : x }) );

clay.x.h = data => xTO_( data, (x) => hsl_to_rgb( x / 256, 1.0, 0.5 ) );

// RESULTS divide by 256 not 255 to get x in the right range for hue

clay.xy.rg = data => xyTO__( data, ( x, y ) => ({ r : x, g : y, b : 0 }) );
clay.xy.gr = data => xyTO__( data, ( x, y ) => ({ r : y, g : x, b : 0 }) );
clay.xy.rb = data => xyTO__( data, ( x, y ) => ({ r : x, g : 0, b : y }) );
clay.xy.br = data => xyTO__( data, ( x, y ) => ({ r : y, g : 0, b : x }) );
clay.xy.gb = data => xyTO__( data, ( x, y ) => ({ r : 0, g : x, b : y }) );
clay.xy.bg = data => xyTO__( data, ( x, y ) => ({ r : 0, g : y, b : x }) );

// copied from rgb-lab

function rgb2xyz(rgb) {
	var r = rgb[0] / 255,
	    g = rgb[1] / 255,
	    b = rgb[2] / 255,
	    x, y, z;

	r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
	g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
	b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

	x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
	y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
	z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

	x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
	y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
	z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
	
	return [x, y, z];
}

// function xyz2luv(xyz){
// 	var x = xyz[0],
// 		y = xyz[1],
// 		z = xyz[2],
// 		l, u, v;
// }

function rgb2hcl() {

}