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

wui.canvas = function( el = null, w = null, h = null ) {
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

	el.style.width  = w / 2 + "px";
	el.style.height = h / 2 + "px";

	// TODO put this into an injected <style></style>

	// el.style.backgroundImage = "url(" + picnic + ")";
}

wui.canvas.prototype.initializeContext = function() {
	var context = this.el.getContext( "2d" );

	context.imageSmoothingEnabled       = false;
	context.msImageSmoothingEnabled     = false;
	context.mozImageSmoothingEnabled    = false;
	context.webkitImageSmoothingEnabled = false;

	return context;
}

var clay = {};

clay.x = {};
clay.xy = {};

function rgb_to_hex(r, g, b) {
	function c_to_hex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	return "#" + c_to_hex(r) + c_to_hex(g) + c_to_hex(b);
}

function hex_to_rgb(hex) {
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

		c[x] = rgb_to_hex( r, g, b );

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
			var hex = rgb_to_hex( r, g, b );
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

function hsl_to_rgb( h, s, l ) {
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

clay.x.r = data => xTO_( data, (x) => ({ r : x }) );

clay.x.h = data => xTO_( data, (x) => hsl_to_rgb( x / 256, 1.0, 0.5 ) );

// RESULTS divide by 256 not 255 to get x in the right range for hue

clay.xy.rg = data => xyTO__( data, ( x, y ) => ({ r : x, g : y, b : 0 }) );
clay.xy.gr = data => xyTO__( data, ( x, y ) => ({ r : y, g : x, b : 0 }) );
clay.xy.rb = data => xyTO__( data, ( x, y ) => ({ r : x, g : 0, b : y }) );
clay.xy.br = data => xyTO__( data, ( x, y ) => ({ r : y, g : 0, b : x }) );
clay.xy.gb = data => xyTO__( data, ( x, y ) => ({ r : 0, g : x, b : y }) );
clay.xy.bg = data => xyTO__( data, ( x, y ) => ({ r : 0, g : y, b : x }) );

//





//

var w = 256;
var h = 256;

var canvas = new wui.canvas( document.getElementById( "canvas" ), w, h );

var hw = Math.floor( w / 2 / 2 ) + 3;
var hh = Math.floor( h / 2 / 2 ) + 3;

var x = 2.5;
var y = 2.5;

var div = canvas.el.parentNode

div.style.left = "calc( ( 20vw - 50px / 5 ) * " + x + " - " + hw + "px )";
div.style.top  = "calc( ( 20vh - 50px / 5 ) * " + y + " - " + hh + "px )";

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

//






//

var div_active = null;

var mouse_x_start = 0;
var mouse_y_start = 0;

var div_x_start = 0;
var div_y_start = 0;

var div_drag = null;

document.addEventListener( "mousedown", function( event ) {
	var div = event.target.closest( "div" );

	//if ( div != div_active ) {
	//	return;
	//}

	mouse_x_start = event.clientX;
	mouse_y_start = event.clientY;

	if ( div ) {
		div_drag = div;
		div_drag.classList.add( "drag" );

		// div_x_start = div.getBoundingClientRect().left;
		// div_y_start = div.getBoundingClientRect().top;

		// document.addEventListener( "mouseup", function( event ) {
		// 	div_drag.classList.remove( "mute" );
		// 	div_drag = null;
		// }, { once : true });
	}
});

document.addEventListener( "mouseup", function( event ) {
	if ( div_drag ) {
		div_drag.classList.remove( "drag" );
		div_drag_cell.classList.add( "mute" );
		div_drag = null;
	}
});

document.addEventListener( "mousemove", function( event ) {
	if ( div_drag ) {
		// var x = div_x_start + event.clientX - mouse_x_start;
		// var y = div_y_start + event.clientY - mouse_y_start;

		// var x = event.clientX - mouse_x_start;
		// var y = event.clientY - mouse_y_start;

		// div_drag.style.transform = "translate(" + x + "px, " + y + "px )";
	}
});

document.addEventListener( "mousedown", function( event ) {
// document.addEventListener( "click", function( event ) {
	var div = event.target.closest( "div" );


	if ( div ) {
		if ( div != div_active ) {
			if ( div_active ) { div_active.classList.remove( "active" ); }
			div_active = div;

			div.classList.add( "active" );
			// div.classList.add( "mute" );

			// div.addEventListener( "mouseout", function( event ) {
			// 	div.classList.remove( "mute" );
			// }, { once : true });
		}
	} else {
		if ( div_active ) { div_active.classList.remove( "active" ); }
	}
});

var main_el = document.getElementById( "main" );

document.querySelectorAll( "g > r > c" ).forEach( function( el, i ) {
	if ( i == 12 ) {
		div_drag_cell = el;
	}

	var y = i % 5;
	var x = ( i - y ) / 5;

	var left = "calc( ( 20vw - 50px / 5 ) * " + ( x + 0.5 ) + " - " + hw + "px )";
	var top = "calc( ( 20vh - 50px / 5 ) * " + ( y + 0.5 ) + " - " + hh + "px )";

	// el.innerHTML = i;
	// el.innerHTML = x + "/" + y;

	el.addEventListener( "dblclick", function( event ) {
		el.classList.add( "mute" );

		var div = document.createElement( "div" );
		div.innerHTML = "<canvas></canvas>";

		div.style.left = left;
		div.style.top  = top;

		main_el.appendChild( div );
	});

	el.addEventListener( "mouseenter", function( event ) {
		if ( div_drag ) {
			div_drag_cell.classList.remove( "mute" );
			div.style.left = left;
			div.style.top  = top;
			div_drag_cell = el;
			// el.classList.add( "mute" );
		}
	});
});

requestAnimationFrame( function() {
	loading_el.remove();
});

document.addEventListener( "keypress", function( event ) {
	// document.body.classList.toggle( "zoom" );
});
