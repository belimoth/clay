"use strict";

import { app, app_canvas_resize } from "../../app.js"

document.getElementById( "side" ).addEventListener( "mouseout", function( event ) {
	// $$( "side panel-header > a" ).forEach( el => el.classList.remove( "mute" ) );
	$$( "side panel-header > a" ).forEach( el => el.classList.remove( "hover" ) );
});

document.getElementById( "side" ).addEventListener( "mousemove", function( event ) {
	$$( "side panel-header > a" ).forEach( el => el.classList.remove( "mute" ) );
	$$( "side panel-header > a" ).forEach( el => el.classList.remove( "hover" ) );
});

export function update_layer_mode() {
	var modes =  [ "full", "normal", "focus", "hidden" ];
	var mode = modes[ app.layer_mode_index  ];
	modes.forEach( el => document.body.classList.remove( "layer-" + el ) );
	document.body.classList.add( "layer-" + mode );

	app.storage.set( "app.mode.layer", app.layer_mode_index );

	// TODO this is lazy
	app_canvas_resize();
}

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var tool_mode_index = 2;

document.getElementById( "menu" ).addEventListener( "mousemove", function( event ) {
	$$( "menu panel-header > a" ).forEach( el => el.classList.remove( "mute" ) );
	// $$( "div.menu panel-header > a" ).forEach( el => el.classList.remove( "hover" ) );
});

export function update_tool_mode() {
	var modes =  [ "full", "normal", "focus", "hidden" ];
	var mode = modes[ tool_mode_index  ];
	modes.forEach( el => document.body.classList.remove( "tools-" + el ) );
	document.body.classList.add( "tools-" + mode );

	app.storage.set( "app.mode.tools", tool_mode_index );

	// TODO this is lazy
	app_canvas_resize();
}
