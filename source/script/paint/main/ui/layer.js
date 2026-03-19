"use strict";

import { canvas_get_context } from "../../../app/canvas.js"

import { app }                from "../../main/app.js"
import { app_init_layer }     from "../../app.js"

export function ui_list_layer( el ) {
	this.el = document.getElementById( "layer" );
	this.select = [];
	this.latch = false;

	let self = this;
	let parent = this;

	this.set_active = function( i ) {
		app.layer_active_index = app.file.layer.length - i - 1;
		Array.from( this.el.children ).forEach( el => el.classList.remove( "active" ) );
		this.el.children[i].classList.add( "active" );
		app.toRepaint = true;

		if ( this.el.children[i].children[0].dataset.label == "new" ) {
			document.getElementById( "label-layer-type" ).removeAttribute( "disabled" );
			document.getElementById( "select-layer-type" ).removeAttribute( "disabled" );
			document.getElementById( "select-layer-type" ).value = "new";
		} else {
			document.getElementById( "label-layer-type" ).setAttribute( "disabled", "" );
			document.getElementById( "select-layer-type" ).setAttribute( "disabled", "" );
			document.getElementById( "select-layer-type" ).value = this.el.children[i].children[0].dataset.label;
		}

	};

	document.addEventListener( "mouseup", function( event ) {
		self.latch = false;
	});

	this.el.addEventListener( "mousedown", function( event ) {
		let el = event.target.closest( "li" );
		if ( ! el ) return;
		let i = [].indexOf.call( el.parentNode.children, el );

		self.latch = true;

		if ( event.ctrlKey ) {

		} else {
			parent.set_active( i );
		}
	});

	this.el.addEventListener( "mouseover", function( event ) {
		let el = event.target.closest( "li" );
		if ( ! el ) return;
		let i = [].indexOf.call( el.parentNode.children, el );

		if ( self.latch ) {
			parent.set_active( i );
		}
	});

	this.draw = function() {
		this.el.innerHTML = "";

		app.file.layer.forEach( function( layer, i ) {
			let el = document.importNode( document.getElementById( "template-layer-item" ).content, true ).children[0];
			el.classList.add( layer.type );
			el.children[0].dataset.label = layer.type;
			self.el.insertBefore( el, self.el.firstChild )
			// self.el.append( el );
		});

		function thumb( el ){
			this.el = el;
			this.context = canvas_get_context( el );

			el.width = 64;
			el.height = 64;
			el.style.width = "32px";
			el.style.height = "32px";
		}

		app.thumbs = [];

		$$( "ul.layer-list > li > a > canvas.thumb" ).forEach( function( el, i ) {
			app.thumbs.unshift( new thumb( el ) );
			// app.thumbs.push( new thumb( el ) );
		});
	};

	this.draw();
	this.set_active(0);

	this.insert = function() {};

	let el_a_insert = document.getElementById( "a-layer-insert" );
	let el_a_dupe   = document.getElementById( "a-layer-dupe" );
	let el_a_merge  = document.getElementById( "a-layer-merge" );
	let el_a_delete = document.getElementById( "a-layer-delete" );

	el_a_insert.onclick = function( event ) {
		self.insert();
		self.set_active( app.file.layer.length - app.layer_active_index - 1 - 1 );
	};

	el_a_dupe.onclick = function( event ) {
		self.dupe();
		self.set_active( app.file.layer.length - app.layer_active_index - 1 - 1 );
	};

	this.insert = function() {
		app.file.layer.forEach( ( el, i ) => el.data = app.context.layer[i].canvas.toDataURL() );
		app.file.layer.splice( app.layer_active_index + 1, 0, { type : "new" } );
		self.draw();
		app.toRepaint = true;
		app.firstRender = true;
		app_init_layer();
		app.context.layer[ app.layer_active_index + 1 ].clearRect( 0, 0, 64, 64 );
	};

	this.dupe = function() {
		app.file.layer.forEach( ( el, i ) => el.data = app.context.layer[i].canvas.toDataURL() );
		let layer = { type : app.file.layer[ app.layer_active_index ].type };
		if ( app.file.layer[ app.layer_active_index ].data ) layer.data = app.file.layer[ app.layer_active_index ].data;
		app.file.layer.splice( app.layer_active_index + 1, 0, layer );
		self.draw();
		app.toRepaint = true;
		app.firstRender = true;
		app_init_layer();
		// app.context.layer[ app.layer_active_index + 1 ].clearRect( 0, 0, 64, 64 );
		// app.context.layer[ app.layer_active_index + 1 ].drawImage( app.context.layer[ app.layer_active_index ].canvas, 0, 0 );
	};
}
