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