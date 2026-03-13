"use strict";

document.addEventListener( "contextmenu", event => { event.preventDefault(); });
document.addEventListener( "wheel",       event => { if ( event.ctrlKey ) event.preventDefault(); }, { "passive" : false });
document.addEventListener( "keydown",     event => { if ( event.ctrlKey && "-=".includes( event.key ) ) event.preventDefault(); });


import { app } from "./main/app.js"

import { app_draw }          from "./main/draw.js";
import { time_format }       from "./app/time.js"

import { tool_all }    from "./main/tool.js";
import { ui_canvas }   from "./main/ui/canvas.js";

import "../app/top.js"



export function wait_frame( callback ) {
	window.requestAnimationFrame( function( time ) { window.requestAnimationFrame( callback ); });
}

function canvas_get_context( canvas ) {
	var context = canvas.getContext( "2d" );

	context.webkitImageSmoothingEnabled = false;
	context.mozImageSmoothingEnabled    = false;
	context.msImageSmoothingEnabled     = false;
	context.imageSmoothingEnabled       = false;

	return context;
}



// NOTE this is fucked gotta do the ui too
// app.file.history = JSON.parse( app.storage.get( "history" ) || "[]" );

export function save_history() {
	// app.storage.set( "history", JSON.stringify( app.history ) );
	// console.log( app.storage.usage() );
}

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

export function app_canvas_resize() {
	app.ui.canvas.resize();
	app.context.display = canvas_get_context( app.ui.canvas.el_canvas );
	app.toRepaint = true;
}

export function app_init() {
	// app.file = new file( document.getElementById( "example" ) );
	app.tool = tool_all.pen_outline;
	app.ui.canvas = new ui_canvas( document.getElementById( "canvas" ) );

	function canvas_make() {
		var el = document.createElement( "canvas" );
		document.getElementById( "offscreen" ).appendChild( el );
		el.width  = app.file.width;
		el.height = app.file.height;
		return el
	}

	var canvasRender = canvas_make();
	var canvasStroke = canvas_make();
	var canvasErase  = canvas_make();

	app.context.render = canvas_get_context( canvasRender );
	app.context.stroke = canvas_get_context( canvasStroke );
	app.context.erase  = canvas_get_context( canvasErase  );

	app.file.layer.forEach( function( el, i ) {
		var canvasLayer = canvas_make();
		canvasLayer.id = "canvas-layer-" + i;
		app.context.layer.push( canvas_get_context( canvasLayer ) );
	});

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



	// document.getElementById( "main" ).classList.add( "tools-focus", "layer-normal" );

	function app_resize() {
		// NOTE i think this is getting fired in addition to onFullscreen below, double check
		app_window_check_fullscreen();
		app_canvas_resize();
	}

	window.addEventListener( "resize", app_resize );















	const fps = 60;

	var interval = 1000 / fps;
	var time_old = 0;

	app.toPause = false;
	app.isRunning = false;

	function loop( time_new ) {
		if ( app.toPause ) {
			app.toPause = false;
			app.isRunning = false;
			app.time_total += app.time - app.time_total; // NOTE dumb as hell
		} else {
			requestAnimationFrame( loop );
			var time_elapsed = time_new - time_old;

			if ( time_elapsed > interval ) {
				time_old = time_new - ( time_elapsed % interval );
				update();
			}
		}
	}

	app.time = 0;
	app.time_start = 0;
	app.time_total = 0;

	var t = 0;

	var timePrevious = 0;

	function start() {
		time_old = window.performance.now();
		loop( time_old );
		app.isRunning = true;

		app.time_start = Math.floor( new Date().getTime() / 1000 );
	}

	start();

	function update() {
		t += 1;

		if ( true ) {
			app.time = Math.floor( new Date().getTime() / 1000 - app.time_start ) + app.time_total;

			if ( app.time != timePrevious ) {
				var time_formatted = time_format( app.time, true );
				document.getElementById( "clock" ).innerHTML = time_formatted;
				timePrevious = app.time;
			}
		}

		if ( app.toRepaint || app.replay ) {
			app_draw();
			app.toRepaint = false;
		}
	}

	window.addEventListener( "blur",  event => { app.toPause = true; });
	window.addEventListener( "focus", start );
}
