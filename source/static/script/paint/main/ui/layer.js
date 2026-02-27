"use strict";

import { app } from "../../app.js"

export function layer( el ) {
	this.el = el;
	this.items = [];
	this.itemActive = null;
	this.select = [];

	var boxes = [];
	var rangeLeft = null;

	var self = this;
	var parent = this;

	var latch = false;

	document.addEventListener( "mouseup", function( event ) {
		latch = false;
	});

	this.set_active = function( item ) {
		app.layer_active_index = app.file.layer.length - item.i - 1;

		if ( this.itemActive ) { this.itemActive.el.classList.remove( "active" ); }
		this.itemActive = item;
		this.itemActive.el.classList.add( "active" );
	};

	this.set_select = function( select ) {
		if ( app.layer_mode_index == 2 ) { return; }
		this.select = select;

		this.items.forEach( el => el.el.classList.remove( "selected" ) );
		this.select.forEach( el => el.el.classList.add( "selected" ) );

		var y = select[0].i * 40;
		var h = select.length * 40 + 2;

		box_el.style = "transform: translateY( " + y + "px ); height: " + h + "px;";
	};

	function item( el, i ) {
		this.el = el;
		this.i = i;

		var self = this;

		el.addEventListener( "mousedown", function( event ) {
			latch = true;
			rangeLeft = self.i;

			if ( event.ctrlKey ) {

			} else {
				parent.set_select([ self ])
				parent.set_active( self );
			}
		});

		el.addEventListener( "mouseover", function( event ) {
			if ( latch ) {
				var rangeMin = Math.min( rangeLeft, self.i );
				var rangeMax = Math.max( rangeLeft, self.i );
				parent.set_select( parent.items.slice( rangeMin, rangeMax + 1 ) );
				parent.set_active( self );
			}
		});
	}

	Array.from( el.children ).forEach( function( el, i ) {
		self.items.push( new item( el, i ) );
	});

	var box_el = document.createElement( "div" );
	box_el.classList.add( "box" );
	el.appendChild( box_el );

	this.set_select([ this.items[0] ]);
	this.set_active( this.items[0] );
}
