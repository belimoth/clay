function createRainbow() {
	var canvas = document.createElement( "canvas" );
	
	var w = canvas.width = 12;
	canvas.height = 1;

	var context = canvas.getContext( "2d" );
	var image   = context.createImageData( w, 1 );
	var data    = image.data;

	for ( var x = 0; x < w; x += 1 ) {
		var hue = x / w;
		var rgb = hsl_to_rgb( hue, 1.0, 0.5 );

		var r = rgb.r;
		var g = rgb.g;
		var b = rgb.b;
		var a = 255;

		// var max = Math.max( r, g, b );

		// if ( max == g ) {
		// 	max = Math.max( r, b );
		// 	g = Math.sqrt( g - max ) + max;
		// }

		// if ( x >= 2 && x < 4 ) {
		// 	g = g * 0.9;
		// }

		if ( x == 2 ) {
			g = g * 12/13;
		}


		if ( x == 3 ) {
			g = g * 15/16;
		}

		if ( x == 5 ) {
			g = g * 11/12;
		}

		data[ x * 4 + 0 ] = r;
		data[ x * 4 + 1 ] = g;
		data[ x * 4 + 2 ] = b;
		data[ x * 4 + 3 ] = a;
	}

	context.putImageData( image, 0, 0 );
	return canvas.toDataURL();
}

function createPicnic() {

	// NOTE throway canvas and context instead of new ImageData(), which is flagged as experimental

	var canvas = document.createElement( "canvas" );

	canvas.width  = 2;
	canvas.height = 2;

	var context = canvas.getContext( "2d" );
	var image   = context.createImageData( 2, 2 );
	var data    = image.data;

	const w = 2;

	var r, g, b, a, x, y, i, ir, ig, ib, ia;

	r = 221;
	g = 221;
	b = 221;
	a = 255;

	x = 1;
	y = 0;

	i = ( x + y * w ) * 4;

	ir = i + 0;
	ig = i + 1;
	ib = i + 2;
	ia = i + 3;

	data[ ir ] = r;
	data[ ig ] = g;
	data[ ib ] = b;
	data[ ia ] = a;

	x = 0;
	y = 1;

	i = ( x + y * w ) * 4;

	ir = i + 0;
	ig = i + 1;
	ib = i + 2;
	ia = i + 3;

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