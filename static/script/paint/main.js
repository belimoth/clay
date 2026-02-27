"use strict";

import { app, app_draw } from "./app.js";
import { update_layer_mode } from "./main/ui/layout.js";
import { update_tool_mode } from "./main/ui/layout.js";
import { tool_init } from "./main/ui/tool.js";
import { time_format } from "./time.js"


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

window.addEventListener( "blur", function( event ) {
	app.toPause = true;
});

window.addEventListener( "focus", function( event ) {
	start();
});

app.layer_mode_index = app.storage.get( "app.mode.layer" ) || 1;
update_layer_mode();
app.tool_mode_index = app.storage.get( "app.mode.tool" ) || 2;
update_tool_mode();

tool_init();
