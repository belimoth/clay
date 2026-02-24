"use strict";

import { hex_to_rgb } from "../../color.js"

var palette_default = [
	{ hex : "#000000", erase : false },
	{ hex : "#B05040", erase : false },
	{ hex : "#E85830", erase : false },
	{ hex : "#E08818", erase : false },
	{ hex : "#F0B018", erase : false },
	{ hex : "#F0E058", erase : false },
	{ hex : "#F0F0A8", erase : false },
	{ hex : "#F8F8F8", erase : false },
	{ hex : "#40A040", erase : false },
	{ hex : "#68D068", erase : false },
	{ hex : "#B8D0F8", erase : false },
	{ hex : "#585858", erase : false },
	{ hex : "#FFFFFF", erase : true  },
];

export function palette( el ) {
	this.el = el;
	this.swatch = [];
	this.swatch_active = null;
	this.select = [];

	var boxes = [];
	var rangeLeft = null;

	var self = this;
	var palette = this;

	var latch = false;

	document.addEventListener( "mouseup", function( event ) {
		latch = false;
	});

	this.set_active = function( swatch ) {
		if ( this.swatch_active ) { this.swatch_active.el.classList.remove( "active" ); }
		this.swatch_active = swatch;
		this.swatch_active.el.classList.add( "active" );
	};

	this.set_select = function( select ) {
		this.select = select;
		var y = select[0].i * 17;
		var h = select.length * 17 - 1;

		box_el.style = "transform: translateY( " + y + "px ); height: " + h + "px;";
	};

	function swatch( el, i ) {
		this.el = el;
		this.i = i;

		// TODO consolidate these two ( var hex & this.hex )
		var hex = el.dataset.color;

		this.erase = false;

		if ( hex == "erase" ) {
			this.erase = true;
			hex = "#FFFFFF";
		}

		this.hex = hex;
		this.rgb = hex_to_rgb( hex );

		if ( this.erase ) {

		} else {
			el.style.background = hex;
		}

		// TODO UGH

		this.rgb.erase = this.erase;

		var self = this;

		el.addEventListener( "mousedown", function( event ) {
			latch = true;
			rangeLeft = self.i;

			if ( event.ctrlKey ) {

			} else {
				palette.set_select([ self ])
				palette.set_active( self );
			}
		});

		el.addEventListener( "mousemove", function( event ) {
			// if ( event.buttons & 1 ) {
			if ( latch ) {
				var rangeMin = Math.min( rangeLeft, self.i );
				var rangeMax = Math.max( rangeLeft, self.i );
				palette.set_select( palette.swatch.slice( rangeMin, rangeMax + 1 ) );
				palette.set_active( self );
			}
		});
	}

	palette_default.forEach( function( el, i ) {
		var swatch_el = document.createElement( "div" );
		swatch_el.classList.add( "swatch" );
		palette.el.appendChild( swatch_el );

		// TODO unnecessary
		swatch_el.dataset.color = el.erase ? "erase" : el.hex;

		var swatchNew = new swatch( swatch_el, i );

		self.swatch.push( swatchNew );
	})

	// Array.from( el.children ).forEach( function( el, i ) {
	// 	self.swatch.push( new swatch( el, i ) );
	// });

	var box_el = document.createElement( "div" );
	box_el.classList.add( "box" );
	el.appendChild( box_el );

	// for ( var i = 0; etc ) {

	// }

	this.set_select([ this.swatch[0] ]);
	this.set_active( this.swatch[0] );

	document.addEventListener( "wheel", function( event ) {
		// TODO subpalette switcher with deltaX
		var isSolo = app.ui.palette.select.length == 1;
		var select = app.ui.palette.select;
		if ( isSolo ) { select = app.ui.palette.swatch; }
		var i = select.indexOf( app.ui.palette.swatch_active );
		i = ( i + Math.sign( event.deltaY ) + select.length ) % select.length;
		app.ui.palette.set_active( select[i] );
		if ( isSolo ) { app.ui.palette.set_select([ select[i] ]); }
	});
}
