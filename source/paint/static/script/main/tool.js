"use strict";

import { app, wait_frame, save_history } from "../app.js"
import { time_format } from "../time.js"

function tool() {
	this.handlers = {};
}

tool.prototype = {
	render : function() {},

	on : function( name, handler ) { this.handlers[ name ] = handler; },
	handle : function( event ) { this.handlers[ event.type ]( event.data ); },

};

export let tool_all = {};

tool_all.pen_outline = new tool();

tool_all.pen_outline.render = function() {

}

var constrain = false;

tool_all.pen_outline.on( "mousemove", function( event ) {
	if ( app.drawing ) {
		if ( constrain ) {
			var i = Math.max( 0, app.stroke.length - 2 );

			var dx = Math.abs( app.mouse.x - app.stroke[i].x );
			var dy = Math.abs( app.mouse.y - app.stroke[i].y );

			var axis = dx > dy;

			app.mouse = {
				x :   axis ? app.mouse.x : app.stroke[i].x,
				y : ! axis ? app.mouse.y : app.stroke[i].y,
			};

			if ( app.stroke.length > 1 ) { app.stroke.pop(); }
		} else if ( event.shift ) {
			app.stroke.pop();
		}

		app.stroke.push( app.mouse );
	}
});

tool_all.pen_outline.on( "mousedown", function( event ) {
	if ( app.drawing ) {
		app.stroke.push( app.mouse );
	} else {

		app.stroke = [ app.mouse ];
	}

	app.drawing = true;
	constrain = event.shift;
});

var count = 0;

tool_all.pen_outline.on( "mouseup", function( event ) {
	if ( event.shift ) {
		constrain = false;
		app.stroke.push( app.mouse );
	} else {
		if ( app.drawing ) {
			var el = document.importNode( document.getElementById( "template-history-item" ).content, true ).children[0];
			var ul = document.getElementById( "history" );

			//<!-- NOTE always one empty element for insertBefore -->
			// <li></li>

			// ul.insertBefore( el, ul.firstElementChild ); // NOTE don't need empty li because there is always a last text node

			var i = count;
			// TODO move this to template

			var j  = "<span class=icon-pen></span><b>" + $( "ul.tool-list > li.active > a" ).dataset.label.toUpperCase() + "</b>";

			var k = " × 3. Canvas";

			el.children[0].innerHTML += "<div>" + j + k + "</div><div class=spacer></div><div class=time>" + time_format( app.time, false ) + "</div>";
			count += 1;

			ul.insertBefore( el, ul.firstChild );

			wait_frame( function() {
				el.classList.remove( "new" );
			});

			app.file.history.push( new history_item( el, i ) );
			save_history();

			app.drawing = false;
			app.toBake = true;
		}
	}
});

function history_item( el, i ) {
	this.el = el;
	this.i = i;

	// TODO
	this.tool_index = 0;
	this.layer_index = 2;
	this.swatch_index = 0;

	this.stroke = app.stroke;

	this.hex = app.ui.palette.swatch_active.hex;
	this.rgb = app.ui.palette.swatch_active.rgb;

	this.el.firstChild.firstChild.style.background = this.hex;
}
