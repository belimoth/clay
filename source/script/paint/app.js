"use strict";

import { canvas_get_context, canvas_make } from "../../../app/canvas.js"

// import { app_main } from "../app/main.js"

import { app } from "./main/app.js"

import { app_draw }          from "./main/draw.js";
import { time_format }       from "./app/time.js"

import { tool_all }    from "./main/tool.js";
import { ui_canvas }   from "./main/ui/canvas.js";

import "../app/top.js"


document.addEventListener( "contextmenu", event => { event.preventDefault(); });
document.addEventListener( "wheel",       event => { if ( event.ctrlKey ) event.preventDefault(); }, { "passive" : false });
document.addEventListener( "keydown",     event => { if ( event.ctrlKey && "-=".includes( event.key ) ) event.preventDefault(); });


export function wait_frame( callback ) {
	window.requestAnimationFrame( function( time ) { window.requestAnimationFrame( callback ); });
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



export function app_init_layer() {
	app.context.layer = [];

	app.file.layer.forEach( function( el, i ) {
		let id =  "canvas-layer-" + i;
		var canvasLayer = canvas_make();
		canvasLayer.id = id;
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
					context.clearRect( 0, 0, 64, 64 );
					context.drawImage( f_layer.image, 0, 0 );
					app.toRepaint = true;
				};

				f_layer.image.src = f_layer.data;
			}
		});
	}

	load();
}

export function app_init() {
	// app.file = new file( document.getElementById( "example" ) );
	app.tool = tool_all.pen_outline;
	app.ui.canvas = new ui_canvas( document.getElementById( "canvas" ) );

	app.context.render = canvas_get_context( canvas_make() );
	app.context.stroke = canvas_get_context( canvas_make() );
	app.context.erase  = canvas_get_context( canvas_make() );

	var canvasPreview = document.getElementById( "preview" );
	app.context.preview = canvas_get_context( canvasPreview );

	app_init_layer();

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
