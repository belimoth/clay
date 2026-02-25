"use strict";

export function rgb_to_hex( rgb ) {
    function c_to_hex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

	return "#" + c_to_hex( Math.round( rgb.r ) ) + c_to_hex( Math.round( rgb.g ) ) + c_to_hex( Math.round( rgb.b ) );
}

export function hex_to_rgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
		r: parseInt(result[1], 16) * 1.0,
		g: parseInt(result[2], 16) * 1.0,
		b: parseInt(result[3], 16) * 1.0
	} : null;
}

export function clamp( value, min, max ) {
	value = Math.max( value, min );
	value = Math.min( value, max );
	return Math.floor( value );
}

function wrap( value, max ) {
	value = Math.floor( value );
	return ( value % max + max ) % max
}

var toggle = false;


export let color = {};

// https://en.wikipedia.org/wiki/Color_difference
// https://www.compuphase.com/cmetric.htm


// console.log( tinycolor( "FF0001" ).toHsl() ); // 360

color.distance2 = function( a, b ) {
	var result = 0;

	var ur = ( a.r + b.r ) / 2;
	var r = a.r - b.r;
	var g = a.g - b.g;
	var b = a.b - b.b;

	result = ( 2 + ur / 256 ) * r * r + 4 * g * g + ( 2 + ( 255 - r ) / 256 ) * b * b
	// result = 2 * r * r + 4 * g * g + 3 * b * b * ur * ( r * r  - b * b ) / 256

	var r2 = r * r;
	var b2 = b * b;

	// the good shit
	// result = 2 * r2 + 4 * g * g + 3 * b2 * ur * ( r2 - b2 ) / 256;

	// result = ( 512 + u ) * r2 / 256  + 4 * g * g + ( 767 - u ) * b2 / 256;
	// result =  4 * g * g + ( ( 512 + u ) * r2 + ( 767 - u ) * b2 ) / 256;

	// if ( toggle ) {
		// result = r * r + g * g + b * b;
	// }

	return Math.abs( result )
}

color.distance_hsl = function( a, b ) {
	// a.h = a.h / 360;
	// b.h = b.h / 360;

	var dh = b.h - a.h;
	if ( Math.abs( dh ) > 180 ) { dh += 360 * - Math.sign( dh ) }
	var ds = b.s - a.s;
	var dl = b.l - a.l;

	var mmm = 8;

	if ( true ) {
		var m = Math.abs( a.l * 2 - 1 );
		m = Math.cos( m * Math.PI / 2 );
		m = m * m * m;
		dh = dh * m;

		mmm = 1
	}




	result = dh * dh / ( 180 * 180 ) + ds * ds * 0 + dl * dl * mmm ;

	return Math.abs( result )
}

// https://stackoverflow.com/questions/41229411/how-to-optimize-execution-time-for-rgb-to-hsl-conversion-function

function rgbToHslOptimized(rgb) {
    var R = rgb.r / 255;
    var G = rgb.g / 255;
    var B = rgb.b / 255;
    var Cmax = Math.max(Math.max(R, G), B);
    var Cmin = Math.min(Math.min(R, G), B);
    var delta = Cmax - Cmin;
    var S = 0;
    var H = 0;
    var L = (Cmax + Cmin) / 2;
    var res = {
        h: 0,
        s: 0,
        l: L
    }
    var remainder = 0;

    if (delta !== 0) {
        S = delta / (1 - Math.abs((2 * L) - 1));

        switch (Cmax) {
            case R:
                H = ((G - B) / delta) % 6;
                break;
            case G:
                H = ((B - R) / delta) + 2;
                break;
            case B:
                H = ((R - G) / delta) + 4;
                break;
        }
        H *= 60;
    }

    if (H < 0) {
        remainder = H % 360;

        if (remainder !== 0) {
            H = remainder + 360;
        }
    }

    res.h = H;
    res.s = S;

    return res;
}

function rgbToHslOptimizedClosure(c) {
    var a = c.f / 255, e = c.b / 255, f = c.a / 255, k = Math.max(Math.max(a, e), f), d = Math.min(Math.min(a, e), f), g = k - d, b = c = 0, l = (k + d) / 2, d = {
        c: 0,
        g: 0,
        h: l
    };
    if (0 !== g) {
        c = g / (1 - Math.abs(2 * l - 1));
        switch (k) {
            case a:
                b = (e - f) / g % 6;
                break;
            case e:
                b = (f - a) / g + 2;
                break;
            case f:
                b = (a - e) / g + 4;
        }
        b *= 60;
    }
    0 > b && (a = b % 360, 0 !== a && (b = a + 360));
    d.c = b;
    d.g = c;
    return d;
}
