"use strict";

import { tool_all } from "./main/tool.js";
import { canvas }   from "./main/ui/canvas.js";

import "../app/top.js"

export let app = {
	mouse : null,
	stroke  : [],

	drawing : false,

	toRepaint :  true,
	toBake    : false,

	file : null,
	tool : null,

	ui : {
		canvas : null,
		palette : null,
	},

	context : {
		display : null,
		render  : null,
		stroke  : null,
		erase   : null,
		layer  : [],
	},

	layer_mode_index   : 1,
	layer_active_index : 2,

	thumbs : [],
};

export function wait_frame( callback ) {
	window.requestAnimationFrame( function( time ) { window.requestAnimationFrame( callback ); });
}

function initializeCanvasContext( canvas ) {
	var context = canvas.getContext( "2d" );

	context.webkitImageSmoothingEnabled = false;
	context.mozImageSmoothingEnabled    = false;
	context.msImageSmoothingEnabled     = false;
	context.imageSmoothingEnabled       = false;

	return context;
}

app.file = {
	width: 64,
	height: 64,

	history : [],

	layer : [
		{ type : "fill" },

		{
			type : "canvas",
			data : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAKlBMVEUAAAAAAADwsBjw4Fjw8KhYWFjgiBjoWDBo0Gj4+PhAoECwUEC40PiI+Ih3NIgLAAAAAXRSTlMAQObYZgAAAVFJREFUSMftk7FOwzAQhps3yO9QiguLL20QIz5gL83IkiIPjK1E9sKQgYmJCIkhgq0sXbsxgcSDwOPgZiR2+gL5hlvus/07Ofc6OtrAjn6gdghCoX0DItUuHN+F7ScUhfIutkuRDYqlTxiEwHc/gzfk4fLls/hA6M/3s3r42gy8EYDH1bB8Xi/rNE0Q6+x3WJYb9ILIIQQnb9Pzclgasw4lOwQhqymPS2P3wat2CFGaTllfM/NY3pNLONsKZIVEPhUugS1EHHNyYK/iyFD3iWecoOa/sE9bEmPiPFIZoWpcc2H7ubmZ8TxCRqqZAnl+a2gcX4D7EZ86PzUWzAwROQVLpGEZpeiDETrHEe8iTS9VBVw5fzosRKMJJI7cUyEl7aXppCIJtyCI7RkqZg3PTLFWghRrCj1CTCoAtP/tiGRus5KtHoI8tEXY6gN1Qa+jw8Mf59FB5AK7Pn0AAAAASUVORK5CYII="
		},

		{ type : "canvas" },
	]
}

// NOTE this is fucked gotta do the ui too
// app.file.history = JSON.parse( app.storage.get( "history" ) || "[]" );

export function save_history() {
	// app.storage.set( "history", JSON.stringify( app.history ) );
	// console.log( app.storage.usage() );
}

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

// app.file = new file( document.getElementById( "example" ) );
app.tool = tool_all.pen_outline;
app.ui.canvas = new canvas( document.getElementById( "canvas" ) );



var canvasRender = document.getElementById( "canvas-render" );
var canvasStroke = document.getElementById( "canvas-stroke" );
var canvasErase  = document.getElementById( "canvas-erase"  );
// var canvasLayer  = document.getElementById( "canvas-layer"  );

canvasRender.width  = app.file.width;
canvasRender.height = app.file.height;

canvasStroke.width  = app.file.width;
canvasStroke.height = app.file.height;

canvasErase.width  = app.file.width;
canvasErase.height = app.file.height;

// canvasLayer.width  = app.file.width;
// canvasLayer.height = app.file.height;

app.context.render = initializeCanvasContext( canvasRender );
app.context.stroke = initializeCanvasContext( canvasStroke );
app.context.erase  = initializeCanvasContext( canvasErase  );
// app.context.layer  = initializeCanvasContext( canvasLayer  );

app.file.layer.forEach( function( el, i ) {
	var canvasLayer = document.createElement( "canvas" );
	canvasLayer.id = "canvas-layer-" + i;

	canvasLayer.width  = app.file.width;
	canvasLayer.height = app.file.height;

	document.getElementById( "offscreen" ).appendChild( canvasLayer );

	app.context.layer.push( initializeCanvasContext( canvasLayer ) );
});

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

app.waitingOn = 0

function load() {
	app.context.layer.forEach( function( el, i ) {
		var f_layer = app.file.layer[i];

		if ( f_layer.data ) {
			app.waitingOn += 1;

			var context = el;
			f_layer.image = new Image();

			f_layer.image.onload = function() {
				app.waitingOn -= 1;
				context.drawImage( f_layer.image, 0, 0 );
			};

			f_layer.image.src = f_layer.data;
		}
	});
}

load();

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

export function app_canvas_resize() {
	app.ui.canvas.resize();
	app.context.display = initializeCanvasContext( app.ui.canvas.el_canvas );
	app.toRepaint = true;
}

// document.getElementById( "main" ).classList.add( "tools-focus", "layer-normal" );

function app_resize() {
	// NOTE i think this is getting fired in addition to onFullscreen below, double check
	app_window_check_fullscreen();
	app_canvas_resize();
}

window.addEventListener( "resize", app_resize );
