"use strict";

import { clamp, color } from "./utility.js"
import { palette_all } from "./palette.js"

var spectrum_el = document.getElementById( "spectrum" );

var w = 256;
w = 1024;
w = 256;

spectrum_el.width  = w;
spectrum_el.height = 256;
spectrum_el.style.width  = w + "px";
spectrum_el.style.height = "256px";

var mode = 3;

var context_spectrum = initializeCanvasContext( spectrum_el, true );

var imageSource = context_spectrum.getImageData( 0, 0, w, 256 );
var rgbData = imageSource.data;

var sourceToRepaint = true;

function repaintSource() {
	for ( var y = 0; y < 256; y += 1 ) {
		for ( var x = 0; x < w; x += 1 ) {
			var i = ( x + y * w ) * 4;

			var c = tinycolor({
				h : x * 360 / w,
				s : ( 255 - sat ) / 255,
				l : ( 255 - y ) / 255,
			});

			var rgb = c.toRgb();

			rgbData[ i + 0 ] = rgb.r;
			rgbData[ i + 1 ] = rgb.g;
			rgbData[ i + 2 ] = rgb.b;
			rgbData[ i + 3 ] = 255;
		}
	}
}

Math.seedrandom( "waugh" );

export let app = {};

var pan = 0;
var sat = 0;
app.sat_squash = 0;

repaintSource();

var imageData = context_spectrum.getImageData( 0, 0, w, 256 );
var data = imageData.data;

export function repaintSpectrum() {
	if ( sourceToRepaint ) {
		repaintSource();
		sourceToRepaint = false;
	}

	if ( mode == 0 ) {
		context_spectrum.putImageData( imageSource, 0, 0 );
		return;
	}

	app.palette.swatches.forEach( function( el, i ) {
		el.hsl = el.c.toHsl();
		el.rgb = el.c.toRgb();
	});

	function fillSample( x, y ) {
		var i = ( x + y * w ) * 4;

		var rgb = {
			r : rgbData[ i + 0 ],
			g : rgbData[ i + 1 ],
			b : rgbData[ i + 2 ],
		};

		var champ = null;

		var hsl = {
			h : x * 360 / w,
			s : ( 255 - sat ) / 255,
			l : ( 255 - y ) / 255,
		};

		app.palette.swatches.forEach( function( el, i ) {
			var d2;


			if ( mode == 1 ) { d2 = color.distance2simple( rgb, el.rgb ); } else
			if ( mode == 2 ) { d2 = color.distance2coef( rgb, el.rgb ); } else
			if ( mode == 3 ) { d2 = color.distance2( rgb, el.rgb ); } else
			if ( mode == 4 ) { d2 = color.distance_hsl( hsl, el.hsl, app.sat_squash ); } else
			{}


			if ( champ == null || d2 < champ.d2 ) {
				champ = { el : el, c : el.c, d2 : d2 };
			}
		});

		rgb = champ.c.toRgb();

		data[ i + 0 ] = rgb.r;
		data[ i + 1 ] = rgb.g;
		data[ i + 2 ] = rgb.b;
		data[ i + 3 ] = 255;

		return champ.c.toRgb();
	}

	imageData = context_spectrum.getImageData( 0, 0, w, 256 );
	data = imageData.data;

	var s = 64;
	s = 2;
	var ww = w / s;
	var hh = 256 / s;

	for ( var y = 0; y < hh; y += 1 ) {
		for ( var x = 0; x < ww; x += 1 ) {
			var xx = Math.floor( x * s + s / 2 );
	 		var yy = Math.floor( y * s + s / 2 );

			for ( var yyy = 0; yyy < s; yyy += 1 ) {
			for ( var xxx = 0; xxx < s; xxx += 1 ) {
				var rgb = fillSample( xx , yy );

				var i = ( ( x * s + xxx ) + ( y * s + yyy ) * w ) * 4;

				data[ i + 0 ] = rgb.r;
				data[ i + 1 ] = rgb.g;
				data[ i + 2 ] = rgb.b;
				data[ i + 3 ] = 255;
			}
			}
		}
	}

	context_spectrum.putImageData( imageData, 0, 0 )

	return;

	for ( n = 0; n < 6; n += 1 ) {
		context_spectrum.fillRect( n * 512 / 6, 0, 1, 256 );
	}
}

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
	}
}

app.palette = new palette( document.getElementById( "palette" ) );

function initializeCanvasContext( canvas, read = false ) {
	var context = canvas.getContext( "2d", { willReadFrequently: read });

	context.mozImageSmoothingEnabled    = false;
	context.webkitImageSmoothingEnabled = false;
	context.msImageSmoothingEnabled     = false;
	context.imageSmoothingEnabled       = false;

	return context;
}

app.palette.generate();

app.hue = {};

app.hue.df = new hue( document.getElementById( "hue-direct"   ) );
app.xy  = new satlig( document.getElementById( "xy"  ) );

app.pan = new hue( document.getElementById( "hue-pan" ) );
app.z = new hue( document.getElementById( "hue-sat" ) );
app.squash = new hue( document.getElementById( "hue-squash" ) );

app.capture = null;
app.xStart = 0;
app.vStart = 0;

app.hue.df.el.addEventListener( "mousedown", function( event ) { app.capture = app.hue.df; });
app.xy.el.addEventListener( "mousedown", function( event ) { app.capture = app.xy; });
app.pan.el.addEventListener( "mousedown", function( event ) { app.capture = app.pan; });
app.z.el.addEventListener( "mousedown", function( event ) { app.capture = app.z; });
app.squash.el.addEventListener( "mousedown", function( event ) { app.capture = app.squash; });

app.paused = false;
app.seedPrevious = 0;
app.plus = 0;


function setHue( h ) {
	var c = new tinycolor({ h : h * 100 / 255 + "%", s : "100%", l : "50%" });

	app.xy.el.style.backgroundColor = c.toHexString();
	app.hue.df.thumb_el.style.background = c.toHexString();
	app.hue.df.thumb_el.style.transform = "translateX( " + h + "px )";

	// var t = - ( h + 128 ) % 256;

	// app.hue.ds.inner_el.style.transform = "translateX( " + t + "px )";
	// app.hue.is.inner_el.style.transform = "translateX( " + t + "px )";
	// app.hue.ms.inner_el.style.transform = "translateX( " + t + "px )";
}

function setHsl( h, s, l ) {
	var c = new tinycolor({ h : h * 100 / 255 + "%", s : s * 100 / 255 + "%", l : ( 255 - l )* 100 / 255 + "%" });

	app.palette.swatch_active.set( c );

	app.xy.thumb_el.style.background = c.toHexString();

	app.xy.thumb_el.style.transform = "translateX( " + s + "px ) translateY( " + l + "px )";

	var lp = ( 255 - l ) * 100 / 255;

	var b = Math.min( 50, lp ) * 2;
	var a =  200 - Math.max( 50, lp ) * 2;

	// lol
	// app.hue.xx.inner_el.style.filter = "saturate( " + s * 100 / 255 + "%" + " ) brightness( " + b + "%" + " )";
	// app.hue.xx.inner_el.style.opacity = a / 100;

	repaintSpectrum();
}

app.hue.df.handle = function( x, y ) {
	app.hue_value = clamp( x, 0, 255 );
	setHue( app.hue_value );
	setHsl( app.hue_value, sat_value, lig_value );
};

setHue( 0);
setHsl(0, 255, 128);

app.pan.handle = function( x, y ) {
	pan = clamp( x, 0, 255 )
	app.pan.thumb_el.style.transform = "translateX( " + pan + "px )";
	var t = - ( pan + 128 ) % 256;
	t = -256 - t;
	app.pan.inner_el.style.transform = "translateX( " + t + "px )";

	repaintSpectrum();
};

app.pan.handle( 128 );

app.z.handle = function( x, y ) {
	sat = clamp( x, 0, 255 )
	app.z.thumb_el.style.transform = "translateX( " + sat + "px )";
	sourceToRepaint = true;
	repaintSpectrum();
}

app.squash.handle = function( x, y ) {
	app.sat_squash = clamp( x, 0, 255 ) / 255
	app.squash.thumb_el.style.transform = "translateX( " + app.sat_squash * 255 + "px )";
	repaintSpectrum();
}

palette_all.sort( function( a, b ) {
	return a.year - b.year;
	return a.data.length - b.data.length;
}).forEach( function( el, i ) {
	var li = document.createElement( "li" );
	var a = document.createElement( "a" );

	var html = "<a data-year><img>name<div>colors</div></a>";
	var data ="";

	var colors = el.data.split( "," ).map( function( el, i ) {
		var hex = "#" + el;
		return tinycolor( hex );
	}).sort( function( a, b ) {
		return Math.random() - Math.random();

		var d_rgb =
			( a.toRgb().b - b.toRgb().b ) * 1000 +
			( a.toRgb().g - b.toRgb().g ) * 100 +
			( a.toRgb().r - b.toRgb().r ) * 1;

		return d_rgb;

		var asb = a.toHsl().s < 0.2 ? 0 : 1;
		var bsb = b.toHsl().s < 0.2 ? 0 : 1;

		var dsb = asb - bsb;

		if ( dsb == 0 ) {
			if ( asb == 0 ) {
				return a.toHsl().l - b.toHsl().l;
			} else {
				return a.toHsl().h - b.toHsl().h;
			}
		} else {
			return dsb;
		}
	});

	colors.forEach( function( el, i ) {
		// data += "<div style=background:hex;></div>".replace( "hex", el.toHexString() );
	})

	html = html.replace( "name", el.name );
	html = html.replace( "year", el.year );
	html = html.replace( "colors", data  );

	li.appendChild( a );
	a.outerHTML = html;
	document.getElementById( "import" ).appendChild( li );

	function activate() {
		app.palette.generate( colors );
		repaintSpectrum();
	}

	li.children[0].addEventListener( "mousedown", function( event ) {
		activate();
	});

	li.children[0].addEventListener( "mouseover", function( event ) {
		if ( ! event.buttons & 1 ) { return; }
		activate();
	});

	li.children[0].addEventListener( "mouseup", function( event ) {
		activate();

		document.getElementById( "panel-list-palette" ).classList.remove( "active" );
		document.getElementById( "panel-palette" ).classList.add( "active" );
		document.getElementById( "panel-palette" ).children[0].innerHTML = "<a>Edit</a> /&nbsp;<a id=a-back>Import</a><span> / " + el.name + "</span>";

		//lol
		document.getElementById( "a-back" ).addEventListener( "click", function( event ) {
			document.getElementById( "panel-list-palette" ).classList.add( "active" );
			document.getElementById( "panel-palette" ).classList.remove( "active" );
		});
	});
});

document.getElementById( "a-back" ).addEventListener( "click", function( event ) {
	document.getElementById( "panel-list-palette" ).classList.add( "active" );
	document.getElementById( "panel-palette" ).classList.remove( "active" );
});


document.getElementById( "a-back" ).addEventListener( "click", function( event ) {
	document.getElementById( "panel-list-palette" ).classList.add( "active" );
	document.getElementById( "panel-palette" ).classList.remove( "active" );
});

document.querySelectorAll( "input[name=distance]" ).forEach( function( el, i ) {
	el.addEventListener( "change", function( event ) {
		mode = el.value;
		repaintSpectrum();
	});
});
