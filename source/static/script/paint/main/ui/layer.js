"use strict";

import { app } from "../../app.js"

export function ui_list_layer( el ) {
	this.el = document.getElementById( "layer" );
	this.items = [];
	this.itemActive = null;
	this.select = [];

	var self = this;
	var parent = this;

	var latch = false;

	document.addEventListener( "mouseup", function( event ) {
		latch = false;
	});

	this.set_active = function( item ) {
		// app.layer_active_index = app.file.layer.length - item.i - 1;
		app.layer_active_index = item.i;
		if ( this.itemActive ) { this.itemActive.el.classList.remove( "active" ); }
		this.itemActive = item;
		this.itemActive.el.classList.add( "active" );
	};

	function item( el, i ) {
		this.el = el;
		this.i = i;

		var self = this;

		el.addEventListener( "mousedown", function( event ) {
			latch = true;

			if ( event.ctrlKey ) {

			} else {
				parent.set_active( self );
			}
		});

		el.addEventListener( "mouseover", function( event ) {
			if ( latch ) {
				parent.set_active( self );
			}
		});
	}

	this.draw = function() {
		this.el.innerHTML = "";
		this.items = [];

		let parent = this;

		app.file.layer.forEach( function( layer, i ) {
			var el = document.importNode( document.getElementById( "template-layer-item" ).content, true ).children[0];
			el.classList.add( layer.type );
			el.children[0].dataset.label = layer.type;
			parent.el.insertBefore( el, parent.el.firstChild )
			self.items.push( new item( el, i ) );
		});

		function canvas_get_context( canvas ) {
			var context = canvas.getContext( "2d" );

			context.webkitImageSmoothingEnabled = false;
			context.mozImageSmoothingEnabled    = false;
			context.msImageSmoothingEnabled     = false;
			context.imageSmoothingEnabled       = false;

			return context;
		}

		function thumb( el ){
			this.el = el;
			this.context = canvas_get_context( el );

			el.width = 64;
			el.height = 64;
			el.style.width = "32px";
			el.style.height = "32px";
		}

		$$( "ul.layer-list > li > a > canvas.thumb" ).forEach( function( el, i ) {
			app.thumbs.unshift( new thumb( el ) );
		});
	};

	this.draw();

	this.set_active( this.items[0] );

	this.insert = function() {

	};

	var el_a_insert = document.getElementById( "a-layer-insert" );
	var el_a_dupe   = document.getElementById( "a-layer-dupe" );
	var el_a_merge  = document.getElementById( "a-layer-merge" );
	var el_a_delete = document.getElementById( "a-layer-delete" );

	el_a_insert.onclick = function( event ) {
		app.ui.layer.insert();
	};

	this.insert = function() {
		app.file.layer.splice( app.file.layer.length - app.layer_active_index, 0, { type : "new" } );
		this.draw();
		app.toRepaint = true;
	};
}
