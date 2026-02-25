"use strict";

var spectrum_el = document.getElementById( "spectrum" );
spectrum_el.width  = 256;
spectrum_el.height = 195;
spectrum_el.style.width  = "256px";
spectrum_el.style.height = "195px";

var image = document.getElementById( "image-test" );

var context_spectrum = initializeCanvasContext( spectrum_el,true);
context_spectrum.drawImage( image, 0, 0 )
var imageData = context_spectrum.getImageData( 0, 0, 256, 195 );
var data = imageData.data;

function repaintSpectrum() {
	context_spectrum.drawImage( image, 0, 0 )

	function fillSample( x, y, w, h ) {
		var i = ( x + y * 256 ) * 4;

		var rgb = {
			r : data[ i + 0 ],
			g : data[ i + 1 ],
			b : data[ i + 2 ],
		};

		var champ = null;

		app.palette.swatches.forEach( function( el, i ) {
			// if ( ! champ ) {
			// 	champ = { c : el.c, d2 : dMax };
			// 	return;
			// }

			var d2 = color.distance2( rgb, el.c.toRgb() );

			if ( champ == null || d2 < champ.d2 ) {
				champ = { c : el.c, d2 : d2 };
			}
		});

		context_spectrum.fillStyle = champ.c.toHexString();
		context_spectrum.fillRect( x , yy , 1, h );
	}

	for ( var x = 0; x < 255; x += 1 ) {
		for ( var y = 0; y < 11; y += 1 ) {
			var yy = y * 12;
			var h = 12;

			if ( y == 1 ) { h == 11; }
			if ( y >= 2 ) { yy -= 1; }

			if ( y == 1 ) { h == 13; }
			if ( y >= 6 ) { yy += 1; }

			if ( y == 10 ) { h = 11; }

			fillSample( x, yy, 1, h );
		}

		for ( var y = 0; y < 64; y += 1 ) {
			var yy = y + 134;
			fillSample( x, yy, 1, 1 );
		}
	}
}

Math.seedrandom( "waugh" );

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

export let color = {};

var toggle = false;

// https://en.wikipedia.org/wiki/Color_difference
// https://www.compuphase.com/cmetric.htm

document.addEventListener( "keypress", function( event ) {
	if ( event.key == " " ) {
		toggle = ! toggle;
		repaintSpectrum();
	}
});

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
	// 	result = r * r + g * g + b * b;
	// }

	return Math.abs( result )
}

function clamp( value, min, max ) {
	value = Math.max( value, min );
	value = Math.min( value, max );
	return Math.floor( value );
}

function wrap( value, max ) {
	value = Math.floor( value );
	return ( value % max + max ) % max
}

var hue_value = 0;
var sat_value = 255;
var lig_value = 128;

function hue( el ) {
	this.el = el;
	this.inner_el = document.createElement( "div" );
	this.thumb_el = document.createElement( "div" );

	this.inner_el.classList.add( "inner" );
	this.thumb_el.classList.add( "thumb" );

	this.el.appendChild( this.inner_el );
	this.el.appendChild( this.thumb_el );

	this.handle = function(){};
}

function satlig( el ) {
	this.el = el;
	this.thumb_el = document.createElement( "div" );
	this.thumb_el.classList.add( "thumb" );
	this.el.appendChild( this.thumb_el );

	this.handle = function( x, y ) {
		sat_value = clamp( x, 0, 255 );
		lig_value = clamp( y, 0, 255 );
		setHsl( hue_value, sat_value, lig_value );
	};
}

function palette( el ) {
	this.el = el;
	this.swatches = [];
	this.swatch_active = null;

	var palette = this;

	function swatch( hex ) {
		this.el = document.createElement( "div" );
		this.el.classList.add( "swatch" );

		this.set = function( c ) {
			this.c = c;
			this.el.style.background = c.toHexString();
		};

		this.set( new tinycolor( hex ) );

		this.select = function() {
			palette.swatch_active.el.classList.remove( "active" );
			palette.swatch_active = self;
			this.el.classList.add( "active" );

			var hsl = this.c.toHsl();
			hue_value = Math.floor( hsl.h * 255 / 360 );
			sat_value = Math.floor( hsl.s * 255 );
			lig_value = Math.floor( 255 - hsl.l * 255 );

			setHue( hue_value );
			setHsl( hue_value, sat_value, lig_value );

			updateQuantize();
		}

		var self = this;

		this.el.addEventListener( "mousedown", function( event ) {
			self.select();
		});

		this.el.addEventListener( "mouseover", function( event ) {
			if ( event.buttons & 1 && ! capture ) {
				self.select();
			}
		});
	}

	this.generate = function( source ) {
		this.el.innerHTML = "";
		this.swatches = [];

		for ( var i = 0; i < 32; i += 1 ) {
			var c = "#" + Math.random().toString(16).substr(-6); // thanks joeeeeee
			if ( i == 0 && document.getElementById( "input-seed" ).value == "waugh" ) { c = "#FF0000"; }

			if ( source ) {
				if ( i > source.length - 1 ) { break; }
				c = source[i]
			} else {
				if ( i > 15 ) { break; }
			}

			var swatch_new = new swatch( c )
			this.swatches.push( swatch_new );
			this.el.appendChild( swatch_new.el );

			if ( i == 0 ) {
				this.swatch_active = swatch_new;
				swatch_new.el.classList.add( "active" )
			}
		}

		updateQuantize()
	}
}

var app = {};

app.palette = new palette( document.getElementById( "palette" ) );

function initializeCanvasContext( canvas, read = false ) {
	var context = canvas.getContext( "2d", { willReadFrequently: read } );

	context.mozImageSmoothingEnabled    = false;
	context.webkitImageSmoothingEnabled = false;
	context.msImageSmoothingEnabled     = false;
	context.imageSmoothingEnabled       = false;

	return context;
}

var context = initializeCanvasContext( document.getElementById( "hue-quantize" ) );

function updateQuantize() {
	var colors = app.palette.swatches.map( function( el ) {
		return new tinycolor( el.c )
	});

	colors = colors.sort( function( a, b ) { return a.toHsl().h - b.toHsl().h });

	var w = 512 / colors.length;

	colors.forEach( function( el, i ) {
		context.fillStyle = el.toHexString();
		context.fillRect( i * w, 0, w, 1 );
	});

	var huep = document.getElementById( "hue-palette" );
	huep.innerHTML = "<div class=inner></div>";

	colors.forEach( function( el, i ) {
		var thumb_el = document.createElement( "div" );
		thumb_el.classList.add( "thumb" );
		thumb_el.style.background = el.toHexString();
		var x = Math.floor( el.toHsl().h * 255 / 360 );
		var y = 0;
		// var y = ( i % 3 ) * 10;
		// thumb_el.style.top = 0;
		thumb_el.style.transform = "translateX( " + x + "px ) translateY( " + y + "px )";
		huep.appendChild( thumb_el );
	});
}

app.palette.generate();

app.hue = {};

app.hue.df = new hue( document.getElementById( "hue-direct"   ) );
app.hue.if = new hue( document.getElementById( "hue-indirect" ) );
app.hue.mf = new hue( document.getElementById( "hue-momentum" ) );

app.hue.ds = new hue( document.getElementById( "hue-direct-spin"   ) );
app.hue.is = new hue( document.getElementById( "hue-indirect-spin" ) );
app.hue.ms = new hue( document.getElementById( "hue-momentum-spin" ) );

app.xy  = new satlig( document.getElementById( "xy"  ) );
app.xym = new satlig( document.getElementById( "xym" ) );

app.hue.xx = new hue( document.getElementById( "hue-repaint" ) );

app.paused = false;
app.capture = null;
app.xStart = 0;
app.Start = 0;

app.hue.df.el.addEventListener( "mousedown", function( event ) { app.capture = app.hue.df; });
app.hue.if.el.addEventListener( "mousedown", function( event ) { app.capture = app.hue.if; });
app.hue.mf.el.addEventListener( "mousedown", function( event ) { app.capture = app.hue.mf; });
app.hue.ds.el.addEventListener( "mousedown", function( event ) { app.capture = app.hue.ds; });
app.hue.is.el.addEventListener( "mousedown", function( event ) { app.capture = app.hue.is; });
app.hue.ms.el.addEventListener( "mousedown", function( event ) { app.capture = app.hue.ms; });

app.xy.el.addEventListener( "mousedown", function( event ) { app.capture = app.xy; });
app.xym.el.addEventListener( "mousedown", function( event ) { app.capture = app.xym; });

// app.xym.el.addEventListener( "mousedown", function( event ) {
// 	app.capture = app.xym;

// 	var x = event.clientX - app.capture.el.getBoundingClientRect().left;
// 	var y = event.clientY - app.capture.el.getBoundingClientRect().top;

// 	impetus_xym.setValues( x * s, y * s );
// });

app.hue.xx.el.addEventListener( "mousedown", function( event ) { app.capture = app.hue.xx; });


document.addEventListener( "mousedown", function( event ) {
	var hue_el = event.target.closest( "div.hue" );

	// TODO just check app.capture;
	if ( app.capture ) {
		if ( app.capture == app.hue.mf || app.capture == app.hue.ms || app.capture == app.xym ) {
			app.paused = false;
		} else {
			app.paused = true;
		}

		app.xStart = event.clientX - app.capture.el.getBoundingClientRect().left;
		app.vStart = hue_value
	}
});

var impetus_mf = new Impetus({
	source : app.hue.mf.el,
	friction : 0.99,
	update : function( x, y ) {
		if ( app.paused ) { return; }
		app.hue.mf.handle( x, y );
	}
});

var impetus_ms = new Impetus({
	source : app.hue.ms.el,
	friction : 0.99,
	update : function( x, y ) {
		if ( app.paused ) { return; }
		app.hue.ms.handle( x, y );
	}
});

const s = 3;

var impetus_xym = new Impetus({
	source : app.xym.el,
	friction : 0.95,
	update : function( x, y ) {
		if ( app.paused ) { return; }
		app.xym.handle( x / s, y / s );
	},
	initialValues : [ 255 * s, 128 * s ],
	boundX : [0, 255 * s],
	boundY : [0, 255 * s],
});

document.addEventListener( "mouseup", function( event ) {
	app.capture = null;
});

document.addEventListener( "mousemove", function( event ) {
	if ( app.capture ) {
		var x = event.clientX - app.capture.el.getBoundingClientRect().left;
		var y = event.clientY - app.capture.el.getBoundingClientRect().top;

		app.capture.handle( x, y )
	}
});

function setHue( h ) {
	var c = new tinycolor({ h : h * 100 / 255 + "%", s : "100%", l : "50%" });

	document.getElementById( "swatch-h" ).style.background = c.toHexString();
	app.xy.el.style.backgroundColor = c.toHexString();
	app.xym.el.style.backgroundColor = c.toHexString();

	app.hue.df.thumb_el.style.background = c.toHexString();
	app.hue.if.thumb_el.style.background = c.toHexString();
	app.hue.mf.thumb_el.style.background = c.toHexString();

	app.hue.ds.thumb_el.style.background = c.toHexString();
	app.hue.is.thumb_el.style.background = c.toHexString();
	app.hue.ms.thumb_el.style.background = c.toHexString();

	app.hue.xx.thumb_el.style.background = c.toHexString();

	app.hue.df.thumb_el.style.transform = "translateX( " + h + "px )";
	app.hue.if.thumb_el.style.transform = "translateX( " + h + "px )";
	app.hue.mf.thumb_el.style.transform = "translateX( " + h + "px )";

	app.hue.ds.thumb_el.style.transform = "translateX( 128px )";
	app.hue.is.thumb_el.style.transform = "translateX( 128px )";
	app.hue.ms.thumb_el.style.transform = "translateX( 128px )";

	app.hue.xx.thumb_el.style.transform = "translateX( " + h + "px )";

	var t = - ( h + 128 ) % 256;

	app.hue.ds.inner_el.style.transform = "translateX( " + t + "px )";
	app.hue.is.inner_el.style.transform = "translateX( " + t + "px )";
	app.hue.ms.inner_el.style.transform = "translateX( " + t + "px )";
}

function setHsl( h, s, l ) {
	var c = new tinycolor({ h : h * 100 / 255 + "%", s : s * 100 / 255 + "%", l : ( 255 - l )* 100 / 255 + "%" });

	app.palette.swatch_active.set( c );

	app.xy.thumb_el.style.background = c.toHexString();
	app.xym.thumb_el.style.background = c.toHexString();
	app.hue.xx.thumb_el.style.background = c.toHexString();
	document.getElementById( "swatch-hsl" ).style.background = c.toHexString();

	app.xy.thumb_el.style.transform = "translateX( " + s + "px ) translateY( " + l + "px )";
	app.xym.thumb_el.style.transform = "translateX( " + s + "px ) translateY( " + l + "px )";

	var lp = ( 255 - l ) * 100 / 255;

	var b = Math.min( 50, lp ) * 2;
	var a =  200 - Math.max( 50, lp ) * 2;

	// lol
	app.hue.xx.inner_el.style.filter = "saturate( " + s * 100 / 255 + "%" + " ) brightness( " + b + "%" + " )";
	app.hue.xx.inner_el.style.opacity = a / 100;

	updateQuantize();
	repaintSpectrum();
}

app.hue.df.handle = function( x, y ) {
	hue_value = clamp( x, 0, 255 );
	setHue( hue_value );
	setHsl( hue_value, sat_value, lig_value );
};

app.hue.if.handle = function( x, y ) {
	hue_value = clamp( app.vStart + ( x - app.xStart ) / 3, 0, 255 );
	setHue( hue_value );
	setHsl( hue_value, sat_value, lig_value );
};

app.hue.mf.handle = function( x, y ) {
	hue_value = wrap( x / 3, 256 );
	setHue( hue_value );
	setHsl( hue_value, sat_value, lig_value );
};

app.hue.ds.handle = function( x, y ) {
	hue_value = wrap( app.vStart + ( app.xStart - x ), 256 );
	setHue( hue_value );
	setHsl( hue_value, sat_value, lig_value );
};

app.hue.is.handle = function( x, y ) {
	hue_value = wrap( app.vStart + ( app.xStart - x ) / 4, 256 );
	setHue( hue_value );
	setHsl( hue_value, sat_value, lig_value );
};

app.hue.ms.handle = function( x, y ) {
	hue_value = wrap( -x / 4 * 2, 256 );
	setHue( hue_value );
	setHsl( hue_value, sat_value, lig_value );
};

app.hue.xx.handle = function( x, y ) {
	hue_value = clamp( x, 0, 255 );
	setHue( hue_value );
	setHsl( hue_value, sat_value, lig_value );
};

setHue( 0);
setHsl(0, 255, 128);

app.seedPrevious = 0;
app.plus = 0;

document.getElementById( "button-generate" ).addEventListener( "click", function( event ) {
	event.preventDefault();

	var seed_el = document.getElementById( "input-seed" );
	var toReseed = ! document.getElementById( "input-keep" ).checked;

	if ( toReseed ) {
		var seed = Date.now().toString();
		seed = parseInt( seed.slice( seed.length - 7, seed.length - 4 ) + "000" );

		if ( seed == app.seedPrevious ) {
			app.seedPrevious = seed;
			seed += app.plus;
			app.plus += 1;
		} else {
			app.seedPrevious = seed;
			app.plus = 1;
		}

		seed_el.value = seed;
	}

	Math.seedrandom( seed_el.value );
	app.palette.generate();
	repaintSpectrum();
});

var palette_all = {
apple2      : [ "#000000", "#515c16", "#843d52", "#ea7d27", "#514888", "#e85def", "#f5b7c9", "#006752", "#00c82c", "#919191", "#c9d199", "#00a6f0", "#98dbc9", "#c8c1f7", "#ffffff"            ],
msx         : [ "#000000", "#cacaca", "#ffffff", "#b75e51", "#d96459", "#fe877c", "#cac15e", "#ddce85", "#3ca042", "#40b64a", "#73ce7c", "#5955df", "#7e75f0", "#64daee", "#b565b3"            ],
zxspectrum  : [ "#000000", "#0022c7", "#002bfb", "#d62816", "#ff331c", "#d433c7", "#ff40fc", "#00c525", "#00f92f", "#00c7c9", "#00fbfe", "#ccc82a", "#fffc36", "#cacaca", "#ffffff"            ],
cga         : [ "#000000", "#0000AA", "#00AA00", "#00AAAA", "#AA0000", "#AA00AA", "#AA5500", "#AAAAAA", "#555555", "#5555FF", "#55FF55", "#55FFFF", "#FF5555", "#FF55FF", "#FFFF55", "#FFFFFF" ],
commodore64 : [ "#000000", "#626262", "#898989", "#adadad", "#ffffff", "#9f4e44", "#cb7e75", "#6d5412", "#a1683c", "#c9d487", "#9ae29b", "#5cab5e", "#6abfc6", "#887ecb", "#50459b", "#a057a3" ],
dawnbringer : [ "#140c1c", "#442434", "#30346d", "#4e4a4e", "#854c30", "#346524", "#d04648", "#757161", "#597dce", "#d27d2c", "#8595a1", "#6daa2c", "#d2aa99", "#6dc2ca", "#dad45e", "#deeed6" ],
pico8       : [ "#000000", "#5f5750", "#82759a", "#c0c1c5", "#fff0e7", "#7d2953", "#ff074e", "#ff76a6", "#a95238", "#ffa108", "#feeb2c", "#ffcaa8", "#008551", "#00e339", "#222e53", "#2cabfe" ]};

var select_el = document.getElementById( "select-palette" );

select_el.innerHTML += "<option></option>"

for ( var el in palette_all ) {
	palette_all[ el ] = palette_all[ el ].sort();
	select_el.innerHTML += "<option>" + el + "</option>";
}

select_el.addEventListener( "change", function( event ) {
	app.palette.generate( palette_all[ select_el.value ] );
	repaintSpectrum();
});

// var dMax = color.distance2( { r : 255, g : 255, b : 255 }, { r: 0,  g: 0 , b : 0 } );
// dMax = 9999999999;

// setInterval( function() {
// 	repaintSpectrum();
// }, 1500 );
