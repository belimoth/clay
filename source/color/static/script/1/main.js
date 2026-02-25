"use strict";

// import { toggle } from "./ui.js"
import { palette_all } from "./palette.js"
import { clamp, color } from "./utility.js"

var spectrum_el = document.getElementById( "spectrum" );

spectrum_el.width  = 256;
spectrum_el.height = 256;
spectrum_el.style.width  = "256px";
spectrum_el.style.height = "256px";

var context_spectrum = initializeCanvasContext( spectrum_el, true );
var imageData = context_spectrum.getImageData( 0, 0, 256, 256 );
var data = imageData.data;

export function repaintSpectrum() {
	function fillSample( x, y, weighted = false ) {
		var i = ( x + y * 256 ) * 4;

		var rgb = {
			r : data[ i + 0 ],
			g : data[ i + 1 ],
			b : data[ i + 2 ],
		};

		var champ = null;

		var hsl = {
			h : ( x * 360 / 255 ) + 1, //idk man
			s : 1.0,
			l : ( 255 - y ) / 255,
		};

		app.palette.swatches.forEach( function( el, i ) {
			var d2;

			// if ( toggle ) {
				// d2 = color.distance_hsl( hsl, el.hsl );
			// } else {
				d2 = color.distance2( rgb, el.c.toRgb() );
			// }

			var wa = 1;
			var wb = 1;

			var w = 1;

			if ( weighted && champ != null && toggle && false ) {
				wa = el.total;
				wb = champ.el.total;

				wa = Math.sqrt( wa );
				wb = Math.sqrt( wb );



				wb = Math.max( wb, 1 );
				w = Math.sqrt( Math.sqrt( wa / wb ) );
			}

			if ( champ == null || d2 * w < champ.d2 ) {
				champ = { el : el, c : el.c, d2 : d2 };
			}
		});

		// var ccc = 10;

		// if ( toggle ) {
		// 	ccc = 1/ 64;
		// }

		// if ( Math.floor( Math.sqrt( champ.d2 ) / ccc ) % 2 != 0 ) {
		// 	champ = { c : tinycolor({
		// 		r : 255 - champ.c.toRgb().r,
		// 		g : 255 - champ.c.toRgb().g,
		// 		b : 255 - champ.c.toRgb().b
		// 	}).darken( 20 ), d2 : champ.d2 };
		// }

		// if ( champ.d2 > 24000 ) {
		// 	champ = { c : tinycolor( "black" ), d2 : 200 };
		// }

		rgb = champ.c.toRgb();

		if ( weighted ) {

			data[ i + 0 ] = rgb.r;
			data[ i + 1 ] = rgb.g;
			data[ i + 2 ] = rgb.b;
			data[ i + 3 ] = 255;
		} else {
			champ.el.total += 1;
		}

		return champ.c.toHexString();
	}



	if ( false ) {
		for ( var y = 0; y < 256; y += 1 ) {
			for ( var x = 0; x < 256; x += 1 ) {
				fillSample( x, y );
			}
		}

		for ( var y = 0; y < 256; y += 1 ) {
			for ( var x = 0; x < 256; x += 1 ) {
				fillSample( x, y, true );
			}
		}
	}

		for ( var y = 0; y < 256; y += 1 ) {
			for ( var x = 0; x < 256; x += 1 ) {
				var i = ( x + y * 256 ) * 4;

				var c = tinycolor({
					h : ( x * 360 / 255 ) + 1, //idk man
					s : 1.0,
					l : ( 255 - y ) / 255,
				});

				var rgb = c.toRgb();

				data[ i + 0 ] = rgb.r;
				data[ i + 1 ] = rgb.g;
				data[ i + 2 ] = rgb.b;
				data[ i + 3 ] = 255;
			}
		}

		context_spectrum.putImageData( imageData, 0, 0 )
	// return;

	imageData = context_spectrum.getImageData( 0, 0, 256, 256 );
	data = imageData.data;

	app.palette.swatches.forEach( function( el, i ) {
		el.hsl = el.c.toHsl();
		el.total = 0;
	});

	context_spectrum.putImageData( imageData, 0, 0 )

	app.palette.swatches.forEach( function( el, i ) {
		var x = Math.floor( ( el.hsl.h * 255 / 360 ) + 255 ) % 255;
		var y = 255 - Math.floor( el.hsl.l * 255 );
		context_spectrum.fillStyle = "#000000";
		context_spectrum.fillRect( x - 4, y - 4, 8, 8 );
		context_spectrum.fillStyle = el.c.toHexString();
		context_spectrum.fillRect( x - 3, y - 3, 6, 6 );
	});

	// context_spectrum.clearRect( 0, 0, 256, 256 );

	// var rows = 16;
	// var total = 0;

	// for ( var y = 0; y < rows; y += 1 ) {
	// 	var columns = Math.pow( 2, ( rows / 2 ) - Math.floor( Math.abs( y - ( rows - 1 )/ 2 ) ) + 0 )

	// 	total += columns
	// 	console.log( "y: " + y + " c: " + columns );

	// 	for ( var x = 0; x < columns; x += 1 ) {
	// 		var w = 256 / columns;
	// 		var h = 256 / rows;


	// 		var xx = Math.floor( x * w + w / 2 );
	// 		var yy = Math.floor( y * h + h / 2 );

	// 		if ( toggle ) {
	// 			context_spectrum.fillStyle = fillSample( xx, yy );
	// 			context_spectrum.fillRect( x * w, y * h, w, h );
	// 		} else {
	// 			context_spectrum.strokeRect( x * w, y * h, w,  h );
	// 		}
	// 	}
	// }

	// console.log( "total: " + total );

	var s = 64;
	s = 32
	var w = 256 / s;
	var h = 256 / s;
	console.log( s * s );

	for ( var y = 0; y < s; y += 1 ) {
		for ( var x = 0; x < s; x += 1 ) {
			var xx = Math.floor( x * w + w / 2 );
	 		var yy = Math.floor( y * h + h / 2 );

			 context_spectrum.fillStyle = fillSample( xx , yy );
			 context_spectrum.fillRect( x * w, y * h, w, h );
		}
	}
}

Math.seedrandom( "waugh" );

export let app = {};

app.hue_value = 0;
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
		setHsl( app.hue_value, sat_value, lig_value );
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
			app.hue_value = Math.floor( hsl.h * 255 / 360 );
			sat_value = Math.floor( hsl.s * 255 );
			lig_value = Math.floor( 255 - hsl.l * 255 );

			setHue( app.hue_value );
			setHsl( app.hue_value, sat_value, lig_value );

			updateQuantize();
		}

		var self = this;

		this.el.addEventListener( "mousedown", function( event ) {
			self.select();
		});

		this.el.addEventListener( "mouseover", function( event ) {
			if ( event.buttons & 1 && ! app.capture ) {
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

app.capture = null;
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
app.xy  = new satlig( document.getElementById( "xy"  ) );

app.hue.xx = new hue( document.getElementById( "hue-repaint" ) );

app.xStart = 0;
app.vStart = 0;

app.hue.df.el.addEventListener( "mousedown", function( event ) { app.capture = app.hue.df; });
app.xy.el.addEventListener( "mousedown", function( event ) { app.capture = app.xy; });
app.hue.xx.el.addEventListener( "mousedown", function( event ) { app.capture = app.hue.xx; });

app.paused = false;
app.seedPrevious = 0;
app.plus = 0;

function setHue( h ) {
	var c = new tinycolor({ h : h * 100 / 255 + "%", s : "100%", l : "50%" });

	document.getElementById( "swatch-h" ).style.background = c.toHexString();
	app.xy.el.style.backgroundColor = c.toHexString();

	app.hue.df.thumb_el.style.background = c.toHexString();
	app.hue.xx.thumb_el.style.background = c.toHexString();

	app.hue.df.thumb_el.style.transform = "translateX( " + h + "px )";
	app.hue.xx.thumb_el.style.transform = "translateX( " + h + "px )";

	// var t = - ( h + 128 ) % 256;

	// app.hue.ds.inner_el.style.transform = "translateX( " + t + "px )";
	// app.hue.is.inner_el.style.transform = "translateX( " + t + "px )";
	// app.hue.ms.inner_el.style.transform = "translateX( " + t + "px )";
}

function setHsl( h, s, l ) {
	var c = new tinycolor({ h : h * 100 / 255 + "%", s : s * 100 / 255 + "%", l : ( 255 - l )* 100 / 255 + "%" });

	app.palette.swatch_active.set( c );

	app.xy.thumb_el.style.background = c.toHexString();
	app.hue.xx.thumb_el.style.background = c.toHexString();
	document.getElementById( "swatch-hsl" ).style.background = c.toHexString();

	app.xy.thumb_el.style.transform = "translateX( " + s + "px ) translateY( " + l + "px )";

	var lp = ( 255 - l ) * 100 / 255;

	var b = Math.min( 50, lp ) * 2;
	var a =  200 - Math.max( 50, lp ) * 2;

	// lol
	// app.hue.xx.inner_el.style.filter = "saturate( " + s * 100 / 255 + "%" + " ) brightness( " + b + "%" + " )";
	// app.hue.xx.inner_el.style.opacity = a / 100;

	updateQuantize();
	repaintSpectrum();
}

app.hue.df.handle = function( x, y ) {
	app.hue_value = clamp( x, 0, 255 );
	setHue( app.hue_value );
	setHsl( app.hue_value, sat_value, lig_value );
};

app.hue.xx.handle = function( x, y ) {
	app.hue_value = clamp( x, 0, 255 );
	setHue( app.hue_value );
	setHsl( app.hue_value, sat_value, lig_value );
};

setHue( 0);
setHsl(0, 255, 128);

var select_el = document.getElementById( "select-palette" );

select_el.innerHTML += "<option></option>"

for ( var el in palette_all ) {
	palette[ el ] = palette_all[ el ].sort();
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
