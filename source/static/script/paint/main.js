"use strict";

import "./reset.js"
import "./math.js"

import "./main/ui/canvas.js"
import "./main/tool.js"

import "./main/ui/scrubber.js"
import "./main/ui/tool.js"
import "./main/ui/layout.js"
import "./main/ui/palette.js"
import "./main/ui/layer.js"
import "./main/ui/history.js"

import "./app.js"
import "./wip.js"
import "./session.js"

import { app, app_canvas_resize }               from "./app.js";
import { app_draw }          from "./main/draw.js";
import { update_layer_mode } from "./main/ui/layout.js";
import { update_tool_mode }  from "./main/ui/layout.js";
import { tool_init }         from "./main/ui/tool.js";
import { time_format }       from "./time.js"









import { ui_list_layer }            from "./main/ui/layer.js";
import { palette }                  from "./main/ui/palette.js";
import { storage }                  from "./session.js";


// TODO don't need type : "mousedown" this already exists in event

app.ui.canvas.el.addEventListener( "mousedown", function( event ) {
	app.mouse = {
		x : ( event.clientX - app.ui.canvas.x ),
		y : ( event.clientY - app.ui.canvas.y ),
	};

	app.tool.handle({ type : "mousedown", data : { shift : event.shiftKey } });
	app.toRepaint = true;
});

document.addEventListener( "mouseup", function( event ) {
	app.mouse = {
		x : ( event.clientX - app.ui.canvas.x ),
		y : ( event.clientY - app.ui.canvas.y ),
	};

	app.tool.handle({ type : "mouseup", data : { shift : event.shiftKey } });
	app.toRepaint = true;
});

app.ui.canvas.el.addEventListener( "mouseout", function( event ) {
	// if ( app.drawing ) {
	// 	app.mouse = {
	// 		x : ( event.clientX - app.ui.canvas.x ),
	// 		y : ( event.clientY - app.ui.canvas.y ),
	// 	};

	// 	app.stroke.push( app.mouse );
	// }

	app.mouse = null;
	app.toRepaint = true;
});

app.ui.canvas.el.addEventListener( "mousemove", function( event ) {
	app.mouse = {
		x : ( event.clientX - app.ui.canvas.x ),
		y : ( event.clientY - app.ui.canvas.y ),
	};

	app.tool.handle({ type : "mousemove", data : { shift : event.shiftKey } });
	app.toRepaint = true;
});

document.addEventListener( "keyup", function( event ) {
	if ( app.drawing && event.key == "Shift" ) {
		app.drawing = false;
		app.toRepaint = true;
	}
});


//

app.storage = new storage();

app.ui.palette   = new palette( $( "div.palette" ) );
app.ui.layer     = new ui_list_layer();
app.history_item = null;






app_canvas_resize();
app_draw();














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

async function get_keyboard_layout() {
	let map = await navigator.keyboard.getLayoutMap();

	map.forEach( function( el, i ) {

	});
}

get_keyboard_layout();
