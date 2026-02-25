var w = 256;
var h = 256;

var canvas = new wui.canvas( document.getElementById( "canvas" ), w, h );

var hw = Math.floor( w / 2 / 2 ) + 3;
var hh = Math.floor( h / 2 / 2 ) + 3;

var x = 2.5;
var y = 2.5;

// var div = canvas.el.parentNode

// div.style.left = "calc( ( 20vw - 50px / 5 ) * " + x + " - " + hw + "px )";
// div.style.top  = "calc( ( 20vh - 50px / 5 ) * " + y + " - " + hh + "px )";

var context = canvas.initializeContext();
var image   = context.createImageData( w, h );
var data    = image.data;

clay.xy.rg( data );
// clay.xy.gr( data );
// clay.xy.rb( data );
// clay.xy.br( data );
clay.xy.gb( data );
// clay.xy.bg( data );

// clay.x.h( data );

context.putImageData( image, 0, 0 );

w = 512;
h = 128;

var spectrum = new wui.canvas( document.getElementById( "spectrum" ), 512, 64, 1 );

context = spectrum.initializeContext();
image   = context.createImageData( w, h );
data    = image.data;

clay.x.h( data );

xyTO__( data, ( x, y ) => hsl_to_rgb( x / 256 , 1.0, 0.5 ) );

// xyTO__( data, function( x, y ) {
// 	var rgb = hsl_to_rgb( x / 256 , 1.0, 0.5 );

// 	var c = "g"

// 	rgb.r = 0;
// 	// rgb.g = 0;
// 	rgb.b = 0;

// 	if ( ( 64 - y ) > rgb[c] / 4 ) {
// 		rgb[c] = 0;
// 	} else {
// 		rgb[c] = 255;
// 	}

// 	return rgb;
// });

context.putImageData( image, 0, 0 );

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var gradient = new wui.gradient( document.getElementById( "gradient" ), {
	stops : [ 0, 1/6, 2/6, 3/6, 4/6, 5/6 ],
});

context = gradient.canvas.initializeContext();
image   = context.createImageData( w, h );
data    = image.data;

var azure_rgb = { r : 0, g : 128, b : 255 };
var azure_hsl = rgb_to_hsl( 0, 128, 255 );

// azure_rgb = { r : 0, g : 0, b : 255 };
// azure_hsl = rgb_to_hsl( 0, 0, 255 );

var hue_width = 1 - azure_hsl.h; // next stop is red;

xyTO__( data,function( x, y ) {
	var hsl = { h: x / 256 , s : 1.0, l : 0.5 };
	var rgb = hsl_to_rgb( hsl.h, hsl.s, hsl.l );

	if ( hsl.h % 1 >= 2/6 && hsl.h % 1 < azure_hsl.h ) {
		hue_width = azure_hsl.h - 2/6;
		var t = ( hsl.h - 2/6 ) / hue_width;

		return {
			r : ( 1 - t ) *   0 + t * azure_rgb.r,
			g : ( 1 - t ) * 255 + t * azure_rgb.g,
			b : ( 1 - t ) *   0 + t * azure_rgb.b,
		};
	} else if ( hsl.h % 1 >= azure_hsl.h ) {
		var t = ( hsl.h - azure_hsl.h ) / hue_width;
		var red = { r : 255, g : 0, b : 0 };

		return {
			r : ( 1 - t ) * azure_rgb.r + t * red.r,
			g : ( 1 - t ) * azure_rgb.g + t * red.g,
			b : ( 1 - t ) * azure_rgb.b + t * red.b,
		};
	}

	return rgb;
});

context.putImageData( image, 0, 0 );

// swatch.set( hexToRgb( "FFAA00" ) );
lab_a = null;
swatch.set( hexToRgb( "33AAFF" ) );
// swatch.set( hexToRgb( "00FFFF" ) );
// swatch.set( hexToRgb( "FF0000" ) );

var rygcbm = [
	[ 255,   0,   0 ],
	[ 255, 255,   0 ],
	[   0, 255,   0 ],
	[   0, 255, 255 ],
	[   0,   0, 255 ],
];

// rygcbm = Array(16).fill(0).map( ( el, i ) => i );

// console.log( rygcbm );

var total = 0;

var widths = [];

for ( var i = 0; i < rygcbm.length; i += 1 ) {
	var j = ( i + 1 ) % rygcbm.length;
	var d = deltaE( rgb2lab( rygcbm[i] ), rgb2lab( rygcbm[j] ) );
	total += d;
	widths.push( d );
}

var stops = widths.map( el => Math.round( el * 256 / total ) );

for ( var i = 1; i < stops.length; i += 1 ) {
	stops[i] += stops[i - 1];
}

stops.unshift(0);

// console.log( stops );

spectrum = new wui.canvas( document.getElementById( "spectrum-lab" ), 512, 64, 1 );
context = spectrum.initializeContext();
image   = context.createImageData( w, h );
data    = image.data;

xyTO__( data,function( x, y ) {
	var i = 0;

	// x = x % 256;

	for ( var j = 0; j < stops.length; j += 1 ) {
		if ( x > stops[j] ){ break; }
		i = j;
	}

	var min = stops[i+0];
	var max = stops[i+1];

	var h = ( x - min ) / ( max - min );

	return hsl_to_rgb( h, 1.0,  0.5 );
});

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

xyTO__( data, function ( x, y ) {
	var rgb = hsl_to_rgb( x % 256 / 256 , 1.0, 0.5 );
	var lab = rgb2lab([ rgb.r, rgb.g, rgb.b ]);

	var t = 64 - lab[0] * 64 / 100

	if ( y > t + 1 ) {
		// t = 64 - t;
		t = ( y - t ) / ( 64 - t );

		t = t * t;

		// return rgb;

		return {
			r : ( 1 - t ) * rgb.r + t * 0,
			g : ( 1 - t ) * rgb.g + t * 0,
			b : ( 1 - t ) * rgb.b + t * 0,
		};
	}

	if ( y > t ) {
		return rgb;
	}

	t = y / t;

	return {
		r : t * rgb.r + ( 1 - t ) * 255,
		g : t * rgb.g + ( 1 - t ) * 255,
		b : t * rgb.b + ( 1 - t ) * 255,
	};

	return {
		r : 0,
		g : 0,
		b : 0,
	};
});

context.putImageData( image, 0, 0 );

var test = widths.reduce( function( el, total ) {
	return total + el;
});